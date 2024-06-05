import Inputsdata from './Inputsdata'
import { ChangeEvent, FormEvent, useState, FocusEvent } from 'react'
import { FormData, FormErrorsProps } from '../types/types'
import alertIcon from '/assets/icon-success-check.svg'
import { z } from 'zod'

// const queryTypeSchema = z.enum(["generalEnquiry", "supportRequest"]);
const firstNameSchema = z.string().min(2).max(50);
const lastNameSchema = z.string().min(2).max(50);
const messageSchema = z.string().min(10).max(500);
const consentSchema = z.literal(true);

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  queryType: null,
  message: '',
  consent: false,
};

const Contactform = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrorsProps>({});
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const validateForm = () => {
    const { firstName, lastName, email, queryType, message, consent } = formData;
    const newErrors: FormErrorsProps = {};

    if (!firstName) {
      newErrors.firstName = 'This field is required'
    } else {
      const firstNameResult = firstNameSchema.safeParse(firstName);
      if (!firstNameResult.success) {
        newErrors.firstName = "First name must be between 2 and 50 characters";
      }
    }

    if (!lastName) {
      newErrors.lastName = 'This field is required'
    } else {
      const lastNameResult = lastNameSchema.safeParse(lastName);
      if (!lastNameResult.success) {
        newErrors.lastName = "Last Name must be between 2 and 50 characters";
      }
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (queryType === null) {
      newErrors.queryType = "Please select a query type";
    }

    const messageResult = messageSchema.safeParse(message);
    if (!message) {
      newErrors.message = 'This field is required'
    } else {
      if (!messageResult.success) {
        newErrors.message = "Message must be between 10 and 500 characters";
      }
    }

    const consentResult = consentSchema.safeParse(consent);
    if (!consentResult.success) {
      newErrors.consent = "To submit this form, please consent to being contacted";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'radio') {
      setFormData(prevState => ({
        ...prevState,
        queryType: value as "generalEnquiry" | "supportRequest" | null,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleInputFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    console.log(`Focus event on: ${name}`); // Debugging line
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (type === 'radio') {
        delete newErrors['queryType'];
      } else {
        delete newErrors[name as keyof FormErrorsProps];
      }
      return newErrors;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isValid = validateForm();
    if (isValid) {
      setIsFormSubmitted(true);
      setAlertMessage('Message Sent!');
      setFormData(initialFormData); // Reset form data using the initial state constant
      setTimeout(() => {
        setAlertMessage(null);
        setIsFormSubmitted(false);
      }, 5000); // Hide the alert after 5 seconds
    } else {
      setIsFormSubmitted(false);
    }
  }

  return (
    <main className='py-8'>
      {alertMessage && isFormSubmitted && (
        <div className='flex justify-center'>
          <div className="text-white bg-dark-grey rounded p-[1.5rem] max-w-[327px] w-full md:max-w-[450px]">
            <div className='flex items-center gap-[8px] rounded-[12px] mb-[8px]'>
              <img src={alertIcon} alt="Check Icon" />
              <p className='font-bold text-[1.12rem]'>Message Sent!</p>
            </div>
            <p className=''>
              Thanks for completing the form. We'll be in touch soon!
            </p>
          </div>
        </div>
      )}
      <div className="px-4 flex justify-center">
        <form onSubmit={handleSubmit} className='bg-white w-full max-w-[690px] md:max-w-[750px] h-full p-6 lg:p-[2.5rem] rounded-[1rem]'>
          <h2 className="font-bold text-[1.8rem] text-[2rem] tracking-[-1px] leading-[2rem] text-dark-grey mb-8">
            Contact Us
          </h2>
          {Inputsdata.map((field, index) => (
            <div key={index} className='md:flex md:items-center md:gap-4'>
              {field.firstRow?.map((field, index) => (
                <div key={index} className={`flex flex-col md:flex-grow ${index === 0 && 'mb-6 md:mb-0'}`}>
                  <label htmlFor={field.id} className='mb-2'>
                    {field.label}<span className='ml-[.5rem]'>*</span>
                  </label>
                  <input
                    className='border border-medium-grey outline-none hover:border-green rounded-[.5rem] py-3 px-6'
                    id={field.id}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof FormData] as string}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    aria-invalid={errors[field.name as keyof FormErrorsProps] ? "true" : "false"}
                    aria-describedby={errors[field.name as keyof FormErrorsProps] ? `${field.id}-error` : undefined}
                  />
                  <p className='text-red mt-2'>
                    {errors[field.name as keyof FormErrorsProps]}
                  </p>
                </div>
              ))}
            </div>
          ))}
          <div className='mt-6'>
            <label htmlFor="email">Email Address
              <span className='ml-[.5rem]'>*</span>
            </label>
            <input
              className='w-full mt-2 border border-medium-grey outline-none hover:border-green rounded-[.5rem] py-3 px-6'
              name="email"
              id="email"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              value={formData.email}
              type="text"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined} />
            <p className='mt-2 text-red'>
              {errors.email}
            </p>
          </div>
          {Inputsdata.map((field, index) => (
            <div key={index} className='md:flex md:items-end md:gap-4'>
              {field.thirdRow?.map((radioField, idx) => (
                <div key={idx} className='flex flex-col mt-6 md:mt-0 md:flex-1'>
                  <label htmlFor={radioField.id} className={`${idx === 0 && 'mb-4 md:mt-6'}`}>
                    {radioField.label}{radioField.star && <span className='ml-[.5rem]'>*</span>}
                  </label>
                  <div className={`flex border border-medium-grey hover:border-green py-3 px-6 rounded-[.5rem] w-full
                        ${formData.queryType === radioField.name && 'bg-medium-lightblue'}`}>
                    <input
                      className='mr-[.75rem]'
                      id={radioField.id}
                      name={radioField.name}
                      onFocus={handleInputFocus}
                      type={radioField.type}
                      value={radioField.name as "generalEnquiry" | "supportRequest"}
                      checked={formData.queryType === radioField.name}
                      onChange={handleInputChange}
                      aria-invalid={errors.queryType ? "true" : "false"}
                      aria-describedby={errors.queryType ? `${radioField.id}-error` : undefined}
                    />
                    <p className='md:text-[1.12rem]'>{radioField.about}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <p className='text-red mt-2'>{errors.queryType}</p>
          <div className='flex flex-col mt-6 mb-[2.5rem]'>
            <label htmlFor="message" className='mb-[.5rem]'>Message <span className='ml-[.5rem]'>*</span></label>
            <textarea
              className='border border-medium-grey py-[.75rem] px-6 leading-[1.688rem] h-[13.5rem] md:h-[8.25rem]'
              name="message"
              id="message"
              value={formData.message}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}>
            </textarea>
            <p className='text-red mt-2'>{errors.message}</p>
          </div>
          <div className='flex gap-4'>
            <input
              type='checkbox'
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              id="consent"
              aria-invalid={errors.consent ? "true" : "false"}
              aria-describedby={errors.consent ? "consent-error" : undefined} />
            <label htmlFor="consent" className='pr-4'>
              I hereby consent to being contacted by the team *
            </label>
          </div>
          <p className='mt-2 text-red'>{errors.consent}</p>
          <div className='flex justify-center mt-[2.5rem]'>
            <button className='submit-btn bg-green text-white text-[1.125rem] w-full py-4 rounded-[.5rem]'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
export default Contactform