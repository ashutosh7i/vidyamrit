import { useSearchParams } from "react-router";

function BaselineAssessmentsPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div>
      <h1>Baseline Assessments</h1>
      <p>Assessment ID: {id}</p>
    </div>
  );
}

export default BaselineAssessmentsPage;
