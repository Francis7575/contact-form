export type FormData = {
    firstName: string
    lastName: string
    email: string
    queryType: "generalEnquiry" | "supportRequest" | null
    message: string
    consent: boolean
}

export type FormErrorsProps = {
    queryType?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
    consent?: string;
};
