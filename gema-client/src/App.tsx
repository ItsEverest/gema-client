import './App.css'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function App() {

  return (
    <>
    <span className='w-full flex items-center justify-center'>
    <Card className='w-full max-w-sm mt-[25vh]'>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login into your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor='email'>Email</Label>
              <Input
                id = "email"
                type = "email"
                placeholder = "name@domain.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor='password'>Password</Label>
                <a href="#" className='text-blue-300 ml-auto inline-block text-sm underline-offset-4 hover:underline'>Forgot your password?</a>
              </div>
              <Input id='password' type='password' required></Input>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type='submit' className='w-full'>Login</Button>
        <Button variant='outline' className='w-full' disabled>Login with Google</Button>
        <p className='inline-block text-sm underline-offset-4'>Don't have an account? <a href="#" className='text-blue-300 hover:underline'>Sign up</a></p>
      </CardFooter>
    </Card>
    </span>
    </>
  )
}

export default App
