import zxcvbn, { ZXCVBNResult, ZXCVBNScore } from 'zxcvbn';

const truncateCpuDemandingPassword = (input: string) => input.substr(0, 100);

const requiredStrengthScore: ZXCVBNScore = 4;

const requiredPasswordLength = 12;

function hasHighestPasswordScore(score: ZXCVBNScore) {
  return score >= requiredStrengthScore;
}

function hasSufficientLength(input: string) {
  return input.length >= requiredPasswordLength;
}

export interface ValidatedPassword extends ZXCVBNResult {
  meetsLengthRequirement: boolean;
  meetsScoreRequirement: boolean;
  meetsAllStrengthRequirements: boolean;
}

export function validatePassword(input: string): ValidatedPassword {
  const password = input.length > 100 ? truncateCpuDemandingPassword(input) : input;
  const result = zxcvbn(password);
  const meetsScoreRequirement = hasHighestPasswordScore(result.score);
  const meetsLengthRequirement = hasSufficientLength(input);
  const meetsAllStrengthRequirements = meetsScoreRequirement && meetsLengthRequirement;

  return Object.freeze({
    ...result,
    meetsScoreRequirement,
    meetsLengthRequirement,
    meetsAllStrengthRequirements,
  });
}

export const blankPasswordValidation = Object.freeze(validatePassword(''));
