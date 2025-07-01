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
// import classes from './LoginPage.module.css';
// import { Layout } from '@/layout/Layout';
// import { useForm } from '@mantine/form';
// import { zodResolver } from 'mantine-form-zod-resolver';
// import { useLogin } from '@/hooks/useLogin';
// import { LoginSchema, type LoginInput } from '@/shared/schemas/LoginSchema';

// export function LoginPage() {
//   const login = useLogin();

//   const form = useForm<LoginInput>({
//     validate: zodResolver(LoginSchema),
//     initialValues: {
//       usernameOrEmail: '',
//       password: '',
//     },
//   });

//   return (
//     <Layout>
//       <Container size={420} my={40}>
//         <Title ta="center" className={classes.title}>
//           Welcome back!
//         </Title>

//         <Text className={classes.subtitle}>
//           Do not have an account yet?{' '}
//           <Anchor component={Link} to="/signup">
//             Create account
//           </Anchor>
//         </Text>
//         <form
//           onSubmit={form.onSubmit((values) => {
//             try {
//               console.log('Submitting login form...', values);
//               login.mutate(values);
//             } catch (error) {
//               console.error('Login submission error:', error);
//             }
//           })}
//         >
//           <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
//             <TextInput
//               label="Username/Email"
//               placeholder="Enter your username or email"
//               {...form.getInputProps('usernameOrEmail')}
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
//             <Group justify="space-between" mt="lg">
//               <Checkbox label="Remember me" />
//               <Anchor component="button" size="sm">
//                 Forgot password?
//               </Anchor>
//             </Group>
//             <Button type="submit" fullWidth mt="xl" radius="md">
//               Sign in
//             </Button>
//           </Paper>
//         </form>
//       </Container>
//     </Layout>
//   );
// }
