const fs = require('fs');

var replaceData = [
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-USRealmHeader.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ContinuityofCareDocumentCCD.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.2.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HistoryandPhysical.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.3.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ConsultationNote.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.4.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureNote.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.6.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-OperativeNote.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.7.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DischargeSummary.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.8.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProgressNote.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.9.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-UnstructuredDocument.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.10.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-TransferSummary.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.13.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ReferralNote.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.14.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CarePlan.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.1.15.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-USRealmHeaderforPatientGeneratedDocument.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.29.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ChiefComplaintSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ReasonforReferralSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-1.3.6.1.4.1.19376.1.5.3.1.3.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HistoryofPresentIllnessSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-1.3.6.1.4.1.19376.1.5.3.1.3.4.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HospitalCourseSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-1.3.6.1.4.1.19376.1.5.3.1.3.5.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ReviewofSystemsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-1.3.6.1.4.1.19376.1.5.3.1.3.18.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HospitalDischargePhysicalSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-1.3.6.1.4.1.19376.1.5.3.1.3.26.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-GeneralStatusSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.2.5.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PhysicalExamSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.2.10.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-OperativeNoteFluidsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.7.12.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SurgicalDrainsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.7.13.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-OperativeNoteSurgicalProcedureSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.7.14.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureEstimatedBloodLossSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.18.2.9.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureDispositionSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.18.2.12.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ObjectiveSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.21.2.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SubjectiveSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.21.2.2.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ActivitiesSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.21.2.3.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.1.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ImmunizationsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.2.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ResultsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.3.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-VitalSignsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.4.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProblemSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.5.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AllergiesAndIntolerancesSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.6.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProceduresSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.7.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AssessmentSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.8.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AssessmentandPlanSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.9.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlanofTreatmentSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.10.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DischargeMedicationsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.11.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ReasonforVisitSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.12.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ChiefComplaintandReasonforVisitSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.13.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-FunctionalStatusSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.14.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-FamilyHistorySection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.15.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HospitalDischargeStudiesSummarySection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.16.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SocialHistorySection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.17.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PayersSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.18.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PastMedicalHistory.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.20.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AdvanceDirectivesSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.21.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-EncountersSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.22.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicalEquipmentSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.23.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DischargeDiagnosisSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.24.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AnesthesiaSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.25.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureDescriptionSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.27.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureFindingsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.28.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureIndicationsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.29.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedProcedureSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.30.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureSpecimensTakenSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.31.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PreoperativeDiagnosisSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.34.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PostoperativeDiagnosisSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.35.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PostprocedureDiagnosisSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.36.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ComplicationsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.37.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationsAdministeredSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.38.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicalGeneralHistorySection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.39.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureImplantsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.40.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HospitalDischargeInstructionsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.41.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HospitalConsultationsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.42.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AdmissionDiagnosisSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.43.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AdmissionMedicationsSectionEntriesOptional.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.44.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-InstructionsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.45.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MentalStatusSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.56.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NutritionSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.57.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HealthConcernsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.58.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-GoalsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.60.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-OutcomesSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.61.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CourseofCareSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.64.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NotesSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.65.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CareTeamsSection.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.2.500.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-IndividualPronounObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.15.2.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AuthorizationActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.1.19.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AdvanceDirectiveObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.1.58.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-EstimatedDateofDelivery.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.15.3.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PregnancyStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.15.3.8.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ResultOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ResultObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.2.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProblemConcernAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.3.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProblemObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.4.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HealthStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.5.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProblemStatus.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.6.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AllergyIntoleranceObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.7.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SeverityObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.8.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ReactionObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.9.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProcedureActivityProcedure.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.14.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.16.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationSupplyOrder.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.17.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationDispense.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.18.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-Indication.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.19.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationInformation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.23.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DrugVehicle.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.24.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PreconditionforSubstanceAdministration.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.25.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-VitalSignsOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.26.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-VitalSignObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.27.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AllergyStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.28.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AllergyConcernAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.30.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AgeObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.31.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ServiceDeliveryLocation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.32.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HospitalDischargeDiagnosis.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.33.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HospitalAdmissionDiagnosis.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.34.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DischargeMedication.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.35.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AdmissionMedication.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.36.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProductInstance.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.37.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SocialHistoryObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.38.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedEncounter.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.40.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedProcedure.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.41.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedMedicationActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.42.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedSupply.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.43.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-FamilyHistoryOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.45.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-FamilyHistoryObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.46.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-FamilyHistoryDeathObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.47.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AdvanceDirectiveObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.48.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-EncounterActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.49.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NonMedicinalSupplyActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.50.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PostprocedureDiagnosis.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.51.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ImmunizationActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.52.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ImmunizationNotGivenReason.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.53.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ImmunizationMedicationInformation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.54.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CoverageActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.60.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PolicyActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.61.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CommentActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.64.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PreoperativeDiagnosis.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.65.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-FunctionalStatusOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.66.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-FunctionalStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.67.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AssessmentScaleObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.69.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CaregiverCharacteristics.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.72.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MentalStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.74.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MentalStatusOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.75.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NumberofPressureUlcersObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.76.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HighestPressureUlcerStage.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.77.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DeceasedObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.79.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-EncounterDiagnosis.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.80.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AssessmentScaleSupportingObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.86.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PolicyActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.87.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PolicyActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.88.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PolicyActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.89.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PolicyActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.90.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CharacteristicsofHomeEnvironment.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.109.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProgressTowardGoalObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.110.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CulturalandReligiousObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.111.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PrognosisObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.113.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-LongitudinalCareWoundObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.114.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ExternalDocumentReference.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.115.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SubstanceAdministeredAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.118.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedImmunizationActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.120.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-GoalObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.121.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-EntryReference.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.122.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DrugMonitoringAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.123.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NutritionalStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.124.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SensoryStatus.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.127.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SelfCareActivitiesADLandIADL.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.128.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedCoverage.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.129.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NutritionRecommendation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.130.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-InterventionAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.131.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HealthConcernAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.132.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-WoundMeasurementObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.133.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-WoundCharacteristic.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.134.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicalEquipmentOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.135.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-RiskConcernAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.136.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NutritionAssessment.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.138.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ReferralAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.140.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-HandoffCommunicationParticipants.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.141.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PriorityPreference.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.143.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-OutcomeObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.144.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CriticalityObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.145.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PlannedInterventionAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.146.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationFreeTextSig.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.147.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-BirthSexObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.200.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SectionTimeRangeObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.201.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-NoteActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.202.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-PregnancyIntentionInNextYear.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.281.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-BrandNameObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.301.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CatalogNumberObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.302.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CompanyNameObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.303.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DeviceIdentifierObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.304.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ImplantableDeviceStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.305.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DistinctIdentificationCodeObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.308.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ExpirationDateObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.309.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-UDIOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.311.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-LatexSafetyObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.314.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-LotOrBatchNumberObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.315.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ManufacturingDateObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.316.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ModelNumberObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.317.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MRISafetyObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.318.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SerialNumberObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.319.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SpecimenCollectionProcedure.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.415.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SpecimenConditionObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.421.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CareTeamOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CareTeamMemberAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CareTeamTypeObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.2.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CareTeamMemberScheduleObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.500.3.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SexualOrientationObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.501.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DateOfDiagnosisAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.502.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-BasicOccupationObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.503.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-BasicIndustryObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.504.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-DisabilityStatusObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.505.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-TribalAffiliationObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.506.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SexObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.507.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-MedicationAdherence.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.508.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CareExperiencePreference.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.509.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-TreatmentInterventionPreference.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.510.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SmokingStatus.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.511.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AverageBloodPressureOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.512.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SexParameterForClinicalUseObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.513.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-InterpreterNeededObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.515.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AgeRangeObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.516.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-CarePlanAct.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.518.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-Reason.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.24.3.88.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SubstanceOrDeviceAllergyIntoleranceObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.24.3.90.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-GenderIdentityObservation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.34.3.45.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AuthorParticipation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.119.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-USRealmPatientNamePTNUSFIELDED.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-USRealmPersonNamePNUSFIELDED.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.1.1.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-USRealmAddress.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.2.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-USRealmDateTimeInterval.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.3.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-USRealmDateTime.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.4.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProvenanceAuthorParticipation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.6.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-ProvenanceAssemblerParticipation.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.7.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-RelatedPersonRelationshipAndNameParticipant.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.5.8.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-InstructionActivity.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.20.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-SmokingStatusMeaningfulUse.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.78.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-TobaccoUse.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.85.html",
  },
  {
    new: "https://hl7.org/cda/us/ccda/StructureDefinition-AdvanceDirectiveOrganizer.html",
    old: "https://hl7.org/cda/stds/ccda/draft1/StructureDefinition-2.16.840.1.113883.10.20.22.4.108.html",
  },
];

let files = fs.readdirSync('./templates');

for (let i = 0; i < files.length; i++) {
  let file = files[i];
  let data = fs.readFileSync('./templates/' + file, 'utf8');
  let oldData = data + "";
  for (let j = 0; j < replaceData.length; j++) {
    data = data.replaceAll(replaceData[j].old, replaceData[j].new);
  }
  if (oldData !== data) {
    console.log("Updating " + file);
    fs.writeFileSync('./templates/' + file, data, 'utf8');
  }
  else{
    console.log("No changes for " + file);
  }
}
