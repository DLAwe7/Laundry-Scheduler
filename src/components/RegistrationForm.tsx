import "./RegistrationForm.css"
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useFormValidator from "../hooks/useFormValidator";

export type AuthMode = "login" | "signup";

export type AuthFormData = {
    doorNumber: string;
    password: string;
    repeatPassword: string;
};


function RegistrationForm() {

    const [mode, setMode] = useState<AuthMode>("login");

    const [formData, setFormData] = useState({
        doorNumber: "",
        password: "",
        repeatPassword: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const { getDoorEmail, validateForm } = useFormValidator();



    const handleSignup = async () => {

        const doorNumber = formData.doorNumber.trim();
        const email = getDoorEmail(doorNumber);

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({


            email,
            password: formData.password,
            options: {
                data: {
                    door_number: doorNumber,
                    role: "user",
                }
            },
        });

        if (signUpError) {
            setFormError(signUpError.message);
            return;
        }

        const userId = signUpData.user?.id;

        if (!userId) {
            setFormError("Impossible de créer le compte utilisateur.");
            return
        }

    }

    const handleLogin = async () => {


        const doorNumber = formData.doorNumber.trim();
        const email = getDoorEmail(doorNumber);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: formData.password,
        });

        if (error) {
            setFormError("Numéro du logement ou mot de passe invalide.");
            return;
        }


    }


    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setFormError("");

        const validationError = validateForm(formData, mode);

        if (validationError) {
            setFormError(validationError);
            setIsSubmitting(false);
            return;
        }

        try {
            if (mode === "signup") {
                await handleSignup();
                return;
            }

            if (mode === "login") {
                await handleLogin();
                return;
            }
        } catch {
            setFormError("Une erreur s’est produite. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }

    };

    return (

        <div className="registration-form-container">

            <form className="registration-form" onSubmit={handleSubmit}>

                <div className="login-toggle">
                    <button className={`login-toggle-button ${mode === "login" ? "active" : ""}`} disabled={isSubmitting}
                        type="button" onClick={() => setMode("login")} aria-pressed={mode === "login"}>

                        <span>Connexion</span>

                    </button>

                    {"|"}

                    <button className={`login-toggle-button ${mode === "signup" ? "active" : ""}`} disabled={isSubmitting}
                        type="button" onClick={() => setMode("signup")} aria-pressed={mode === "signup"}>

                        <span>Inscription</span>

                    </button>
                </div>

                <label className="sr-only" htmlFor="door-number-input">Numéro de logement</label>
                <input id="door-number-input" type="text" value={formData.doorNumber} onChange={(e) =>
                    setFormData(prev => ({
                        ...prev,
                        doorNumber: e.target.value,
                    }))
                } placeholder="Numéro de logement" autoComplete="off" />


                <label className="sr-only" htmlFor="password-input">Mot de passe</label>
                <input id="password-input" type="password" value={formData.password} onChange={(e) =>
                    setFormData(prev => ({
                        ...prev,
                        password: e.target.value,
                    }))
                } placeholder="Mot de passe" autoComplete={mode === "login" ? "current-password" : "new-password"} />


                {mode === "signup" && (
                    <>
                        <label className="sr-only" htmlFor="repeat-password-input">Retaper le mot de passe</label>
                        <input id="repeat-password-input" type="password" value={formData.repeatPassword}

                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    repeatPassword: e.target.value,
                                }))
                            } placeholder="Retaper le mot de passe" autoComplete="off" />

                    </>
                )}



                <button disabled={isSubmitting} className="login-submit-button" type="submit">{isSubmitting ? "Please wait..." : mode === "login" ? "Connexion" : "Enregistrer"}</button>

                {formError && <> <p className="form-error">
                    {formError}
                </p></>}

            </form >

        </div >

    );
};

export default RegistrationForm;