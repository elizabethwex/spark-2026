import { Navigate, useNavigate, useParams } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import PlaceholderStepPage from "./PlaceholderStepPage";
import DependentsPage from "./DependentsPage";
import BeneficiariesPage from "./BeneficiariesPage";
import MedicalPlansPage from "./MedicalPlansPage";
import DentalPlansPage from "./DentalPlansPage";
import VisionPlansPage from "./VisionPlansPage";
import SpendingAccountsPage from "./SpendingAccountsPage";
import FsaPage from "./FsaPage";
import LpfsaPage from "./LpfsaPage";
import DcfsaPage from "./DcfsaPage";
import HraPage from "./HraPage";
import HsaPage from "./HsaPage";
import HsaAddFundsPage from "./HsaAddFundsPage";
import AccidentInsurancePage from "./AccidentInsurancePage";
import HospitalIndemnityPage from "./HospitalIndemnityPage";
import ReviewSubmitPage from "./ReviewSubmitPage";
import { flattenEnrollmentStepIds, getEnrollmentSteps } from "../../components/enrollment/enrollmentSteps";
import { loadSpendingAccountsState } from "../../lib/spendingAccountsStorage";

export default function EnrollmentStepRoute() {
  const navigate = useNavigate();
  const params = useParams();
  const steps = getEnrollmentSteps();
  const allStepIds = flattenEnrollmentStepIds(steps);

  const stepId = (() => {
    const id = params.stepId;
    if (!id) return null;
    if (!allStepIds.includes(id)) return null;
    return id;
  })();

  if (!stepId) {
    return <Navigate to="/enrollment/profile" replace />;
  }

  const onStepChange = (nextId: string) => {
    if (nextId === "select-plans") return navigate("/enrollment/medical-plans");
    if (nextId === "spending-accounts") return navigate("/enrollment/spending-accounts");
    if (nextId === "voluntary-supplemental-benefits") return navigate("/enrollment/accident-insurance");
    navigate(`/enrollment/${nextId}`);
  };

  const onBack = () => {
    const freshIds = flattenEnrollmentStepIds(getEnrollmentSteps());
    const idx = freshIds.indexOf(stepId!);
    const prev = freshIds[Math.max(0, idx - 1)];
    if (!prev) return;

    if (stepId === "medical-plans") return navigate("/enrollment/decision-support-opt-in");

    if (stepId === "spending-accounts") return navigate("/enrollment/plans-checkpoint");

    if (stepId === "accident-insurance") {
      const spendingState = loadSpendingAccountsState();
      if (spendingState.selected.length > 0) {
        return navigate("/enrollment/spending-accounts-checkpoint");
      }
    }

    const resolvedPrev = prev === "select-plans" || prev === "voluntary-supplemental-benefits"
      ? freshIds[Math.max(0, idx - 2)]
      : prev;
    navigate(`/enrollment/${resolvedPrev}`);
  };

  const onNext = () => {
    const freshIds = flattenEnrollmentStepIds(getEnrollmentSteps());
    const idx = freshIds.indexOf(stepId!);
    const next = freshIds[Math.min(freshIds.length - 1, idx + 1)];
    if (!next) return;

    if (stepId === "dependents") return navigate("/enrollment/decision-support-opt-in");

    if (stepId === "vision-plans") return navigate("/enrollment/plans-checkpoint");

    const spendingAccountSubsteps = ["fsa", "lpfsa", "dcfsa", "hra", "hsa", "hsa-add-funds", "beneficiaries"];
    const isSpendingAccountSubstep = spendingAccountSubsteps.includes(stepId);
    const nextIsSupplemental = next === "voluntary-supplemental-benefits";

    if (isSpendingAccountSubstep && nextIsSupplemental) {
      return navigate("/enrollment/spending-accounts-checkpoint");
    }

    const resolvedNext =
      next === "select-plans"
        ? "medical-plans"
        : next === "voluntary-supplemental-benefits"
          ? "accident-insurance"
          : next;
    navigate(`/enrollment/${resolvedNext}`);
  };

  const onCancel = () => {
    navigate("/enrollment/home", { replace: true });
  };

  if (stepId === "profile") {
    return (
      <ProfilePage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }
  if (stepId === "dependents") {
    return (
      <DependentsPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "beneficiaries") {
    return (
      <BeneficiariesPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "medical-plans") {
    return (
      <MedicalPlansPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "dental-plans") {
    return (
      <DentalPlansPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "vision-plans") {
    return (
      <VisionPlansPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "spending-accounts") {
    return (
      <SpendingAccountsPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "fsa") {
    return (
      <FsaPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "lpfsa") {
    return (
      <LpfsaPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "dcfsa") {
    return (
      <DcfsaPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "hra") {
    return (
      <HraPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "hsa") {
    return (
      <HsaPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "hsa-add-funds") {
    return (
      <HsaAddFundsPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "accident-insurance") {
    return (
      <AccidentInsurancePage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "hospital-indemnity") {
    return (
      <HospitalIndemnityPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onNext={onNext}
        onCancel={onCancel}
      />
    );
  }

  if (stepId === "review-submit") {
    return (
      <ReviewSubmitPage
        currentStepId={stepId}
        onStepChange={onStepChange}
        onBack={onBack}
        onCancel={onCancel}
      />
    );
  }

  return (
    <PlaceholderStepPage stepId={stepId} onStepChange={onStepChange} onBack={onBack} onNext={onNext} onCancel={onCancel} />
  );
}