export function getTodoImageUrl(itemId: string) {
  const s3Bucket = process.env.BUCKET_NAME;
  const url = `https://${s3Bucket}.s3-us-west-2.amazonaws.com/${itemId}.png`;
  console.log(url);
  return url;
}