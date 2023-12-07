

export async function POST(request){
  const jsonBody = await request.json();
  const mongoURL = process.env.MONGO_URL;

  return Response.json({jsonBody,mongoURL} )
}

