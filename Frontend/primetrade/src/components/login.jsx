import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import API from "@/api";
import { Link, replace, useNavigate } from "react-router-dom";

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid Email Address' }),
    password: z.string().min(1, { message: "password is required" }),
});

export default function Login() {
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values) {

        try {
            const { data } = await API.post('/auth/login', {
                email: values.email,
                password: values.password,
            });

            localStorage.setItem('token', data.token);

            localStorage.setItem('user', JSON.stringify(data));

            toast.success('Login Successful!');

            navigate('/', { replace: true });

        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMsg);
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Card className='w-full max-w-lg'>
                <CardHeader>
                    <CardTitle className='text-2xl'> Login </CardTitle>
                    <CardDescription> Welcome Back! Please sign in to your account. </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <CardContent className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Email </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder='Enter Your Email'
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Password </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='Enter Your Password'
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4" />
                                )} {isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>

                            <p className="text-center text-sm text-gray-500">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-primary hover:underline">Register</Link>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

