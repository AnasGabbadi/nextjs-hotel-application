import { gql } from "@apollo/client";
import client from "client";
import { cleanAndtransformBlocks } from "./cleanAndtransformBlocks";
import { mapMainMenuItems } from "./mapMainMenuItems";
import { PropertyFeatures } from "components/PropertyFeatures";

export const getPageStaticProps = async (context) => {
console.log("CONTEXT:", context);
const uri = context.params?.slug ? `/${context.params.slug.join("/")}/` : "/";
const { data } = await client.query({
    query: gql`
    query PageQuery($uri: String!) {
        nodeByUri(uri: $uri) {
            ... on Page {
                id
                title   
                blocks(postTemplate: false)
                seo {
                    title
                    metaDesc
                }
            }
            ... on Property {
                id
                title   
                blocks(postTemplate: false)
                seo {
                    title
                    metaDesc
                }
            }
        }
        acfOptionsMainMenu {
        mainMenu {
            callToActionButton {
            destination {
                ... on Page {
                uri
                }
            }
            label
            }
            menuItems {
            menuItem {
                destination {
                ... on Page {
                    uri
                }
                }
                label
            }
            items {
                destination {
                ... on Page {
                    uri
                }
                }
                label
            }
            }
        }
        }
    }   
    `,
    variables: {
        uri,
    }
});
const blocks = cleanAndtransformBlocks(data.nodeByUri.blocks);
return {    
    props: {
        seo: data.nodeByUri.seo,
        title: data.nodeByUri.title,
        propertyFeatures: data.nodeByUri.propertyFeatures || null,
        featuredImage: data.nodeByUri.featuredImage?.node?.sourceUrl || null,
    mainMenuItems: mapMainMenuItems(
        data.acfOptionsMainMenu.mainMenu.menuItems
    ),
    callToActionLabel: data.acfOptionsMainMenu.mainMenu.callToActionButton.label,
    callToActionDestination: data.acfOptionsMainMenu.mainMenu.callToActionButton.destination.uri,
    blocks,
    },
};
};