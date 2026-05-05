import type { AuthFormData, AuthMode } from "../components/RegistrationForm";




export default function useFormValidator() {

    const ADMIN_IDENTIFIERS = ["administration"];

    const isAdminIdentifier = (value: string) => {
        return ADMIN_IDENTIFIERS.includes(value.trim().toLowerCase());
    };


    const getDoorEmail = (identifier: string) => {
        const trimmed = identifier.trim();

        if (isAdminIdentifier(trimmed)) {
            return "admin@laundry.local";
        }

        return `door-${trimmed}@laundry.local`;
    };

    const isValidDoorNumber = (value: string) => {
        const trimmed = value.trim();

        if (!/^\d+$/.test(trimmed)) {
            return false;
        }

        const doorNumber = Number(trimmed);

        return (
            (doorNumber >= 1 && doorNumber <= 9) ||
            (doorNumber >= 10 && doorNumber <= 20) ||
            (doorNumber >= 21 && doorNumber <= 30) ||
            (doorNumber >= 31 && doorNumber <= 46)
        );
    };


    const validateForm = (formData: AuthFormData, mode: AuthMode) => {
        const doorNumber = formData.doorNumber.trim();

        if (!doorNumber) {
            return "Door number is required.";
        }

        if (mode === "signup" && !isValidDoorNumber(doorNumber)) {
            return "Door number is not valid.";
        }

        if (mode === "login" && !isValidDoorNumber(doorNumber) && !isAdminIdentifier(doorNumber)) {
            return "Door number is not valid.";
        }

        if (!formData.password) {
            return "Password is required.";
        }

        if (formData.password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (mode === "signup" && formData.password !== formData.repeatPassword) {
            return "Passwords do not match.";
        }

        return "";
    };


    return { getDoorEmail, validateForm };

}