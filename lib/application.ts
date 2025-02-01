import { z } from 'zod';

export const applicationSchema = z.object({
    firstName: z.string().describe("The first name of the applicant"),
    lastName: z.string().describe("The last name of the applicant"),
    phone: z.string().describe("The phone number of the applicant"),
    email: z.string().describe("The email address of the applicant"),
    profession: z.string().describe("The profession of the applicant"),
    specialty: z.string().describe("The specialty of the applicant"),
    employer: z.string().describe("The employer of the applicant"),
    startingDate: z.string().describe("The starting date that the applicant is looking to move in"),
    income: z.number().describe("The income of the applicant"),
    funds: z.number().describe("The funds of the applicant"),
    hometown: z.string().describe("The hometown of the applicant"),
    proposedRent: z.number().describe("The proposed rent of the applicant in USD."),
    otherOccupants: z.array(z.string()).describe("The other occupants of the applicant"),
    roommates: z.array(z.string()).describe("The roommates of the applicant"),
})

export type Application = z.infer<typeof applicationSchema> & {
    id: string;
};
