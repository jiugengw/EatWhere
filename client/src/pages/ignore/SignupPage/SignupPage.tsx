// import {
//   Anchor,
//   Button,
//   Checkbox,
//   Container,
//   Group,
//   Paper,
//   PasswordInput,
//   Text,
//   TextInput,
//   Title,
// } from '@mantine/core';
// import { Link } from '@tanstack/react-router';
// import classes from './SignupPage.module.css';
// import { Layout } from '@/layout/Layout';
// import { useForm } from '@mantine/form';
// import { zodResolver } from 'mantine-form-zod-resolver';
// import { useSignup } from '@/hooks/useSignup';
// import { SignupSchema, type SignupInput } from '@/shared/schemas/SignupSchema';

// export function SignupPage() {
//   const signup = useSignup();

//   const form = useForm<SignupInput>({
//     validate: zodResolver(SignupSchema),
//     initialValues: {
//       firstName: '',
//       lastName: '',
//       username: '',
//       email: '',
//       password: '',
//       passwordConfirm: '',
//     },
//   });

//   return (
//     <Layout>
//       <Container size={420} my={40}>
//         <Title ta="center" className={classes.title}>
//           Create an account
//         </Title>

//         <Text className={classes.subtitle}>
//           Already have an account?{' '}
//           <Anchor component={Link} to="/login">
//             Log in
//           </Anchor>
//         </Text>
//         <form
//           onSubmit={form.onSubmit((values) => {
//             try {
//               console.log('Submitting signup form...', values);
//               signup.mutate(values);
//             } catch (error) {
//               console.error('Signup submission error:', error);
//             }
//           })}
//         >
//           <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
//             <TextInput
//               label="First Name"
//               placeholder="Enter your first name"
//               {...form.getInputProps('firstName')}
//               required
//               radius="md"
//             />
//             <TextInput
//               label="Last Name"
//               placeholder="Enter your last name"
//               {...form.getInputProps('lastName')}
//               required
//               radius="md"
//             />
//             <TextInput
//               label="Username"
//               placeholder="Enter your username"
//               {...form.getInputProps('username')}
//               required
//               radius="md"
//             />
//             <TextInput
//               label="Email"
//               placeholder="Enter your email"
//               {...form.getInputProps('email')}
//               required
//               radius="md"
//             />
//             <PasswordInput
//               label="Password"
//               placeholder="Enter your password"
//               {...form.getInputProps('password')}
//               required
//               mt="md"
//               radius="md"
//             />
//             <PasswordInput
//               label="Confirm Password"
//               placeholder="Confirm your password"
//               {...form.getInputProps('passwordConfirm')}
//               required
//               mt="md"
//               radius="md"
//             />
//             <Group justify="space-between" mt="lg">
//               <Checkbox label="Remember me" />
//               <Anchor component="button" size="sm">
//                 Forgot password?
//               </Anchor>
//             </Group>
//             <Button type="submit" fullWidth mt="xl" radius="md">
//               Sign up
//             </Button>
//           </Paper>
//         </form>
//       </Container>
//     </Layout>
//   );
// }
