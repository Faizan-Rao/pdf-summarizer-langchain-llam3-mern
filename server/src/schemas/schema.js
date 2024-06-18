import z from 'zod'

export const signUpSchema = z.object({
    identifier: z.string({message: "identifier is not string"}),
    password: z.string({message: "identifier is not string"}),
    name: z.string({message: "identifier is not string"}),
})

export const signInSchema = z.object({
    identifier: z.string({message: "identifier is not string"}),
    password: z.string({message: "identifier is not string"}),
})