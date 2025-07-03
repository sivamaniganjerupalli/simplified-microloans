// src/context/FormContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    surname: "",
    email: "",
    aadhar: "",
    phone: "",
    wallet: "",
    location: "",
    role: ""
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("dhanSetuForm");
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setCurrentStep(5); // assume final step if form is saved
    }
  }, []);

  // Save progress on form data change
  useEffect(() => {
    localStorage.setItem("dhanSetuForm", JSON.stringify(formData));
  }, [formData]);

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
