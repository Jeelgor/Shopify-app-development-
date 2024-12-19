import {
  Page,
  List,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react"; // Assuming Remix framework

// Fetch data in the loader
export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const { admin } = await authenticate.admin(request);

  const Orderresponse = await admin.graphql(
    `#graphql
  query OrdersCount {
    ordersCount(limit: 2000) {
      count
      precision
    }
  }`,
  );

  const OrderresponseData = await Orderresponse.json();
  const Ordercount = OrderresponseData.data.ordersCount.count;


  const Productresponse = await admin.graphql(
    `#graphql
    query {
      productsCount(query: "id:>=1000") {
        count
      }
    }`
  );

  const data = await Productresponse.json();
  const count = data.data.productsCount.count;


  const Customerresponse = await admin.graphql(
    `#graphql
    query CustomerCount {
      customersCount {
        count
      }
    }`,
  );

  const CustomerresponseData = await Customerresponse.json();
  const CustomerCount = CustomerresponseData.data.customersCount.count;
  return { count, Ordercount, CustomerCount };

};

// Index component
export default function Index() {
  const { count, Ordercount, CustomerCount } = useLoaderData();
  return (
    <Page>
      <List type="bullet">
        <List.Item>Product Count:{count}</List.Item>
        <List.Item>Order Count:{Ordercount}</List.Item>
        <List.Item>Customer Count:{CustomerCount}</List.Item>
      </List>
    </Page>
  );
}
