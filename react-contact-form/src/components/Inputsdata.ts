import iconRadio from '/assets/icon-radio-selected.svg'

const InputFields = [
    {
        firstRow: [
            { type: 'text', name: 'firstName', id: 'firstName', label: 'First Name', },
            { type: 'text', name: 'lastName', id: 'lastName', label: 'Last Name', }
        ]
    },
    {
        thirdRow: [
            { type: 'radio', name: 'generalEnquiry', id: 'generalEnquiry', label: 'Query Type', about: 'General Enquiry', star: true, icon: iconRadio },
            { type: 'radio', name: 'supportRequest', id: 'supportRequest', about: 'Support Request', star: false, icon: iconRadio }
        ]
    }
];

export default InputFields