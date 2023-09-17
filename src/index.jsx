import ForgeUI, { render, ContextMenu, InlineDialog, Text, Strong, useProductContext, useState } from '@forge/ui';
import { fetch } from '@forge/api';


/**
 * Set the PQAI API Key as follows:
 * forge variables set --encrypt PQAI_API_KEY your-key
 * export FORGE_USER_VAR_PQAI_API_KEY=your-key
 */
const getPQAIAPIKey = () => {
  return process.env.PQAI_API_KEY;
}

const App = () => {
  const { extensionContext: { selectedText } } = useProductContext();
  const [data] = useState(async () => {
    const endpoint = "https://api.projectpq.ai"; 
    const route = "/search/102?"; 
    var url = endpoint + route; 
    var token = getPQAIAPIKey();
    const q = { q: selectedText, // search query with the user's selected text
                n: 10, // return 10 results 
                type: "patent", // exclude research papers
                token: getPQAIAPIKey() 
                } 
    url = url + new URLSearchParams(q).toString();
    const response = await fetch(url, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.text();
    return data;
  })

  return (
    <InlineDialog>
      <Text><Strong>PriorWise Prior Art Check</Strong></Text>
      <Text>{data}</Text>
    </InlineDialog>
  );
};

export const run = render(
  <ContextMenu><App/></ContextMenu>
);
