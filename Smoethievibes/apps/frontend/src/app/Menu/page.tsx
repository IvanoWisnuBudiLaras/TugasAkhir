
import { Button } from '@smoethievibes/ui';

export default function MenuPage() {
  return (
    <>
    <div className='bg-blue-500 m-4 p-2 border-2 border-black rounded-md flex items-center content-center wrap'>
      <p className='text-white text-2xl font-bold'>Menu</p>
    </div>
    <div className="p-4 space-x-4">
      <Button variant="default">Default Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="secondary">Secondary Button</Button>
    </div>
    </>
  )
}