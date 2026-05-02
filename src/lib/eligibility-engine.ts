interface EligibilityInput {
  age: number;
  isCitizen: boolean;
  isRegistered: boolean;
  isDisqualifiedByCourt: boolean;
  state: string;
}

interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  actionSteps: string[];
  registrationUrl: string;
}

interface RulesJson {
  voting_age: number;
  citizenship_required: boolean;
  disqualifiers: string[];
  registration_deadline_days_before_election: number;
  registration_url: string;
  id_accepted: string[];
}

export function checkEligibility(
  input: EligibilityInput,
  rules: RulesJson
): EligibilityResult {
  const reasons: string[] = [];
  const actionSteps: string[] = [];

  if (input.age < rules.voting_age) {
    reasons.push(`Must be at least ${rules.voting_age} years old (you are ${input.age})`);
  }
  if (rules.citizenship_required && !input.isCitizen) {
    reasons.push("Must be an Indian citizen");
    actionSteps.push("Obtain Indian citizenship to become eligible");
  }
  if (input.isDisqualifiedByCourt) {
    reasons.push("Disqualified by court order under RPA 1951");
    actionSteps.push("Consult a legal advisor regarding your disqualification status");
  }
  if (!input.isRegistered) {
    actionSteps.push(
      `Register as a voter at ${rules.registration_url} — ensure you register at least ${rules.registration_deadline_days_before_election} days before the election`
    );
  }

  const eligible = reasons.length === 0;
  if (eligible && !input.isRegistered) {
    actionSteps.unshift("Complete voter registration to exercise your right to vote");
  }

  return {
    eligible,
    reasons,
    actionSteps,
    registrationUrl: rules.registration_url,
  };
}
