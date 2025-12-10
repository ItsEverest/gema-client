import './App.css'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const socketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000"
const socket = io(socketServerUrl)

socket.on("test", (value) => {
  console.log(value)
})

function App() {
  const [notify, setNotify] = useState<{title: string, description: string} | null>(null)
  const [notifyQueue, setNotifyQueue] = useState<{title: string, description: string}[]>([])
  const [error, setError] = useState<{title: string, description: string} | null>(null)
  const [errorQueue, setErrorQueue] = useState<{title: string, description: string}[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function errorMessage(title: string, description: string){
    setErrorQueue(prevQueue => [...prevQueue, { title, description }])
  }

  function notifyMessage(title: string, description: string){
    setNotifyQueue(prevQueue => [...prevQueue, { title, description }])
  }

  function loginCheck(email:string, password:string){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email.length <= 25 && email.length > 0 && emailPattern.test(email)){
      console.log("test")
      if(password.length <= 255 && password.length > 8){
        socket.emit("loginAttempt", {email, password})
      }
      else {
        errorMessage("Password is incorrect", "The password didn't meet the criteria. Try again")
      }
    }
    else {
      errorMessage("Login is incorrect", "The login didn't meet the criteria. Try again")
    }
  }

  useEffect(() => {
    const onError = (title: string, description: string) => { errorMessage(title, description);}
    const onNotify = (title: string, description: string) => { notifyMessage(title, description) }

    socket.on('errorMessage', onError)
    socket.on('notifyMessage', onNotify)

    return () => {
      socket.off('errorMessage', onError)
      socket.off('notifyMessage', onNotify)
    }
    
  }, [])

  useEffect(() => {
    if(errorQueue.length > 0 && error === null){
      console.log("here")
      setError(errorQueue[0])
    }
  }, [errorQueue, error])

  useEffect(() => {
    if(error !== null){
      const timer = setTimeout(() => {
        setError(null)
        setErrorQueue(prev => prev.slice(1))
      }, 5000);
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if(notifyQueue.length > 0 && notify === null){
      setNotify(notifyQueue[0])
    }
  }, [notifyQueue, notify])

  useEffect(() => {
    if(notify !== null){
      const timer = setTimeout(() => {
        setNotify(null)
        setNotifyQueue(prev => prev.slice(1))
      }, 5000);
      return () => clearTimeout(timer)
    }
  }, [notify])




  return (
    <>
    <span className='w-full flex items-center justify-center'>

    {error && <Alert variant="destructive" className='fixed max-w-[20vw] min-w-[300px] text-left animate-test top-full'>
        <AlertCircleIcon />
        <AlertTitle>{error.title}</AlertTitle>
        <AlertDescription>
          {error.description}
        </AlertDescription>
    </Alert>}

    {notify && <Alert variant="default" className='fixed max-w-[20vw] min-w-[300px] text-left animate-test top-full'>
        <CheckCircle2Icon />
        <AlertTitle>{notify.title}</AlertTitle>
        <AlertDescription>
          {notify.description}
        </AlertDescription>
    </Alert>}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor='password'>Password</Label>
                <a href="#" className='text-blue-300 ml-auto inline-block text-sm underline-offset-4 hover:underline'>Forgot your password?</a>
              </div>
              <Input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type='submit' className='w-full' onClick={() => {loginCheck(email, password)}}>Login</Button>
        <Button variant='outline' className='w-full' disabled>Login with Google</Button>
        <p className='inline-block text-sm underline-offset-4'>Don't have an account? <a href="#" className='text-blue-300 hover:underline'>Sign up</a></p>
      </CardFooter>
    </Card>
    </span>
    </>
  )
}

export default App
