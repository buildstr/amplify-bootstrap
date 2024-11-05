import { Config } from '../../../../../../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchTestRoute = (props: Config) => {
    return `export async function GET(request: Request,{ params }: { params: { id: number }}) {
    const id = params.id
    console.log(id)
    const res = await fetch(\`http://numbersapi.com/\${id}?json\`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
  
    return Response.json(data)
  }`;
};
export default fetchTestRoute;
