// Form component types

export type FormInputProps = {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

export type FormSelectProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}

export type AddButtonProps = {
  onClick: () => void;
  label?: string;
}

export type RemoveButtonProps = {
  onClick: () => void;
  index: number;
}

export type UpdateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
}

export type EditProfileButtonProps = {
  onClick: () => void;
}

export type SelectOtherProfileButtonProps = {
  onClick: () => void;
}

export type LogoutButtonProps = {
  onClick: () => void;
}