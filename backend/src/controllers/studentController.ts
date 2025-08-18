import { Response } from 'express';
import User from '../models/UserModel';
import { UserRole } from '../configs/roles';
import { AuthRequest } from '../types/auth';
import { CreateUserRequest, UpdateUserRequest, UserParams } from '../types/requests';

export const createStudent = async (
    req: AuthRequest<{}, {}, Omit<CreateUserRequest, 'password'>>,
    res: Response
) => {
    try {
        const { name, email, uid, schoolId } = req.body;
        const userSchoolId = req.user && req.user.role !== UserRole.SUPER_ADMIN ? req.user.schoolId : schoolId;

        if (!userSchoolId) {
            return res.status(400).json({ error: "School ID is required" });
        }

        // Check if student already exists
        const existingStudent = await User.findOne({ 
            $or: [
                { email, role: UserRole.STUDENT },
                { uid, role: UserRole.STUDENT }
            ]
        });
        if (existingStudent) {
            return res.status(400).json({ 
                error: existingStudent.email === email 
                    ? "Student with this email already exists"
                    : "Student with this roll number already exists"
            });
        }

        // Create student in MongoDB with provided UID as roll number
        const student = new User({
            uid,  // Use provided UID as roll number
            name,
            email,
            role: UserRole.STUDENT,
            schoolId: userSchoolId
        });

        await student.save();
        const populatedStudent = await student.populate('schoolId', 'name');

        res.status(201).json({
            _id: populatedStudent._id,
            name: populatedStudent.name,
            email: populatedStudent.email,
            role: populatedStudent.role,
            schoolId: populatedStudent.schoolId
        });
    } catch (error) {
        console.error('Error in student creation:', error);
        res.status(500).json({ error: "Failed to create student" });
    }
};

export const getStudents = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response
) => {
    try {
        const { schoolId } = req.query;
        const filter: any = { role: UserRole.STUDENT };
        
        // If not super admin, only show students from user's school
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            filter.schoolId = req.user.schoolId;
        } else if (schoolId) {
            filter.schoolId = schoolId;
        }

        const students = await User.find(filter)
            .select('-__v')
            .populate('schoolId', 'name');

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

export const getStudent = async (
    req: AuthRequest<UserParams>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const query: any = { 
            _id: id, 
            role: UserRole.STUDENT 
        };

        // If not super admin, only allow fetching students from same school
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            query.schoolId = req.user.schoolId;
        }

        const student = await User.findOne(query)
            .select('-__v')
            .populate('schoolId', 'name');

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: "Failed to fetch student" });
    }
};

export const updateStudent = async (
    req: AuthRequest<UserParams, {}, UpdateUserRequest>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const query: any = { _id: id, role: UserRole.STUDENT };
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            query.schoolId = req.user.schoolId;
        }

        // Update the student record
        const updatedStudent = await User.findOneAndUpdate(
            query,
            { 
                ...(name && { name }),
                ...(email && { email })
            },
            { new: true }
        ).populate('schoolId', 'name');

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({
            _id: updatedStudent._id,
            name: updatedStudent.name,
            email: updatedStudent.email,
            role: updatedStudent.role,
            schoolId: updatedStudent.schoolId
        });

    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: "Failed to update student" });
    }
};

export const deleteStudent = async (
    req: AuthRequest<UserParams>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const query: any = { _id: id, role: UserRole.STUDENT };
        
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            query.schoolId = req.user.schoolId;
        }

        const deletedStudent = await User.findOneAndDelete(query);
        if (!deletedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: "Failed to delete student" });
    }
};
