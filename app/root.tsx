
import { MetaFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { createBrowserClient } from '@supabase/auth-helpers-remix'
import { useEffect, useState } from "react";
import { json, useRevalidator } from "react-router-dom";
import styles from './styles/global.css'
import type { Database } from "./types/database";
import { createSupabaseServerClient } from "./utils/supabase.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chat en vivo",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  {
    rel: "stylesheet", href: styles
  },
];

export const loader = async ({ request }: LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  }

const response = new Response()

const supabase = createSupabaseServerClient({ request, response })

  const { data: { session} } = await supabase.auth.getSession()

  return json({ env, session }, { headers: response.headers })
}

export default function App() {
  const { env, session: serverSession } = useLoaderData<typeof loader>()
  const revalidator = useRevalidator()

  //console.log('server', {session})

  const [supabase] = useState(() => createBrowserClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    )
  )

  useEffect(() => {
    supabase.auth.getSession()
    .then(({ data: { session } }) => {
      console.log('client', { session })
    })
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token != serverSession?.access_token){
        revalidator.revalidate()
      }
    })

    return () => subscription?.unsubscribe()
  }, []
  )

  return (
    <html lang="es">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        
          <Outlet context={ supabase } />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        
        
          <section>
            <img alt="1" src="https://cdn.shopify.com/static/sample-images/garnished.jpeg"/>
            <img alt="2" src="https://cdn.shopify.com/static/sample-images/bath.jpeg"/>
            <img alt="3" src="https://cdn.shopify.com/static/sample-images/teapot.jpg"/>
            <img alt="4" src="https://cdn.shopify.com/s/files/1/0229/0839/files/bancos_de_imagenes_gratis.jpg?v=1630420628&width=1024"/>
            <img alt="5" src="https://cdn.shopify.com/static/sample-images/shoes.jpeg"/>

          </section>

          <input name="6" type="file" accept="image/*" capture="user"/>
          <input name="7" type="file" accept="image/*" capture="environment"/>

          <input name="8" type="file" accept="video/*" capture="user"/>
          <input name="9" type="file" accept="video/*" capture="environment"/>
         
      </body>
    </html>
  );
}
