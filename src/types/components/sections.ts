// Section component types
import { BodyStatus, ExerciseInfo, Cautions, Preferences } from '../profile/profile';
import { ContactInfo, PaymentInfo } from '../account/account';

export type ContactInfoSectionProps = {
  contactInfo: ContactInfo;
  onContactInfoChange: (field: keyof ContactInfo, value: string) => void;
  errors?: Partial<Record<keyof ContactInfo, string>>;
}

export type BodyStatusInfoSectionProps = {
  bodyStatus: BodyStatus;
  onBodyStatusChange: (field: keyof BodyStatus, value: string | number) => void;
  errors?: Partial<Record<keyof BodyStatus, string>>;
}

export type ExerciseInfoSectionProps = {
  exerciseInfo: ExerciseInfo[];
  onExerciseInfoChange: (exerciseInfo: ExerciseInfo[]) => void;
  errors?: string[];
}

export type CautionsSectionProps = {
  cautions: Cautions[];
  onCautionsChange: (cautions: Cautions[]) => void;
  errors?: string[];
}

export type PreferencesSectionProps = {
  preferences: Preferences[];
  onPreferencesChange: (preferences: Preferences[]) => void;
  errors?: string[];
}

export type PaymentInfoSectionProps = {
  paymentInfo: PaymentInfo;
  onPaymentInfoChange: (field: keyof PaymentInfo, value: string) => void;
  errors?: Partial<Record<keyof PaymentInfo, string>>;
}

export type ProfileNameSectionProps = {
  profileName: string;
  onProfileNameChange: (value: string) => void;
  error?: string;
}

export type AccountNameSectionProps = {
  accountName: string;
  onAccountNameChange: (value: string) => void;
  error?: string;
}

export type LoginIdSectionProps = {
  loginId: string;
  onLoginIdChange: (value: string) => void;
  error?: string;
}

export type PasswordSectionProps = {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  errors?: {
    password?: string;
    confirmPassword?: string;
  };
}