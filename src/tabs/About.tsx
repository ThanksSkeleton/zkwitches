import ReactMarkdown from 'react-markdown';

export default function About() {

  const md = `
  # zkWitches: A Social Deduction Game Played On-Chain using ZKProofs
  For up to date documentation, check the [GitHub](https://github.com/ThanksSkeleton/zkwitches).
  `;

  return (
    <ReactMarkdown children={md}/>
  );
}