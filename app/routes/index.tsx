import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { createSupabaseServerClient } from '../utils/supabase.server';
import { Login } from '../components/Login'

// Loader de Datos en el Server
export const loader = async({ request }: LoaderArgs) => {
  const response = new Response()
  const supabase = createSupabaseServerClient({ request, response })
  const {data} = await supabase.from('messages').select()
  
  return json({messages: data ?? []}, { headers: response.headers })
}

export default function Index() {
  const {messages} = useLoaderData<typeof loader>()

  return (
    <main>
      <h1>
        CHAT EN VIVO - COMUNIDAD QUARZO
     </h1>
     <Login/>
      
      <pre>
        {JSON.stringify("Mensaje: " + messages[1].content, null, 2)}
      </pre>
      
    </main>
    
  );
}
