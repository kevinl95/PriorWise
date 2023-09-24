import ForgeUI, {
  render,
  ContextMenu,
  ContentBylineItem,
  InlineDialog,
  Table,
  Head,
  Row,
  Cell,
  Text,
  Strong,
  Heading,
  Link,
  Image,
  useProductContext,
  useState,
  Tabs, 
  Tab
} from "@forge/ui";
import api, {route, fetch} from "@forge/api";


/**
 * Set the PQAI API Key as follows:
 * forge variables set --encrypt PQAI_API_KEY your-key
 * export FORGE_USER_VAR_PQAI_API_KEY=your-key
 */
const getPQAIAPIKey = () => {
  return process.env.PQAI_API_KEY;
};

async function getPageText(api, contentId) {
    // https://developer.atlassian.com/cloud/confluence/rest/#api-api-content-id-get
    // status=any is necessary to support pages in draft
    const contentPath = route`/wiki/rest/api/content/${contentId}?status=any&expand=body.atlas_doc_format`;
    const res = await api
      .asUser()
      .requestConfluence(contentPath);
    const responseData = await res.json();
    if (responseData.code) {
      console.log('Response data:\n' + JSON.stringify(responseData, null, 2));
      return undefined;
    } else {
      const adfJson = responseData.body.atlas_doc_format.value;
      console.log(adfJson);
      const adf = JSON.parse(adfJson);
      const content = adf.content;
      var retStr = "";
      var arrayLength = content.length;
      for (var i = 0; i < arrayLength; i++) {
          const val = content[i].content[0];
          if (val.hasOwnProperty("text")) {
            retStr = retStr + val.text + " ";
          }
      }
      console.log(retStr);
      return retStr;
    }
  };

const App = () => {
  const {
    extensionContext: { selectedText },
  } = useProductContext();
  const [data] = useState(async () => {
    const context = useProductContext();
    var searchText = selectedText;
    if (selectedText === undefined) {
      const adf = await getPageText(api, context.contentId);
      searchText = adf;
    }
    console.log(searchText);
    const endpoint = "https://api.projectpq.ai";
    const route = "/search/102?";
    var url = endpoint + route;
    const q = {
      q: searchText, // search query with the user's selected text
      n: 30, // Get at least 30 results
      type: "patent", // exclude research papers
      token: getPQAIAPIKey(),
    };
    url = url + new URLSearchParams(q).toString();
    const response = await fetch(url, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.text();
    const res = JSON.parse(data);
    return res;
  });

  return (
    <InlineDialog>
      <Heading size="large">PriorWise Prior Art Check</Heading>
      <Text>Top patents most similar to your text:</Text>
      <Tabs>
        <Tab label="Results">
          <Table>
            <Head></Head>
            {Object.keys(data.results).reverse().slice(0,10).map((pat) => (
              <Row>
                <Cell>
                  <Heading size="medium">{data.results[pat].title}</Heading>
                  <Image src={data.results[pat].image} />
                  <Text>
                    <Strong>Author: </Strong>
                    {data.results[pat].alias}
                  </Text>
                  <Text>
                    <Strong>PriorWise Similarity Score: {Math.round(data.results[pat].score * 100)}%</Strong>
                  </Text>
                  <Text>
                    <Strong>Published: </Strong>
                    {data.results[pat].publication_date}
                  </Text>
                  <Text>
                    <Strong>ID: </Strong>
                    {data.results[pat].id}
                  </Text>
                  <Text>
                    <Strong>Link: </Strong>
                    <Link href={data.results[pat].www_link}>
                      {data.results[pat].www_link}
                    </Link>
                  </Text>
                </Cell>
              </Row>
            ))}
          </Table>
        </Tab>
        <Tab label="See more">
          <Table>
            <Head></Head>
            {Object.keys(data.results).reverse().slice(10).map((pat) => (
              <Row>
                <Cell>
                  <Heading size="medium">{data.results[pat].title}</Heading>
                  <Image src={data.results[pat].image} />
                  <Text>
                    <Strong>Author: </Strong>
                    {data.results[pat].alias}
                  </Text>
                  <Text>
                    <Strong>PriorWise Similarity Score: {Math.round(data.results[pat].score * 100)}%</Strong>
                  </Text>
                  <Text>
                    <Strong>Published: </Strong>
                    {data.results[pat].publication_date}
                  </Text>
                  <Text>
                    <Strong>ID: </Strong>
                    {data.results[pat].id}
                  </Text>
                  <Text>
                    <Strong>Link: </Strong>
                    <Link href={data.results[pat].www_link}>
                      {data.results[pat].www_link}
                    </Link>
                  </Text>
                </Cell>
              </Row>
            ))}
          </Table>
        </Tab>
      </Tabs>
    </InlineDialog>
  );
};

export const inlineRun = render(
  <ContextMenu>
    <App />
  </ContextMenu>
);

export const fullpageRun = render(
  <ContentBylineItem>
      <App/>
  </ContentBylineItem>
);
