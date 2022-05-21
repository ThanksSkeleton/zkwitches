import ReactMarkdown from 'react-markdown';

export default function About() {

  const md = `
  # zkWitches: A Social Deduction Game Played On-Chain using ZKProofs
  For up to date documentation, check the [GitHub](https://github.com/ThanksSkeleton/zkwitches).

  ## Acknowledgements / Credits
  Dev+UI : ThanksSkeleton ThanksSkeleton#9425 (Me!)

  Inspiration by many social deduction games: Loveletter and Coup in particular.

  Instruction by ZKU/zkDao

  Project Template: https://github.com/socathie/zkPhoto-ui by socathie

  Royalty Free Town Pixel Art and Pixel Art Citizens by ansimuz 

  Royalty Free Witch Pixel Art by 9E0
  `;

  return (
    <ReactMarkdown children={md}/>
  );
}