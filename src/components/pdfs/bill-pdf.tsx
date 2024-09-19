import { Bill, Shop, TabOverview } from '@/types/types';
import { formatCurrencyUSD } from '@/util/currency';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styleSheet = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  section: {
    textAlign: 'center',
    padding: 10
  },
  table: {
    flexDirection: 'column',
    border: '2px solid black',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1px 5px',
    fontSize: '10px'
  },
  tableHeader: {
    borderBottom: '2px solid black',
    backgroundColor: '#EEEEEE',
    fontSize: '14px'
  },
  tableFooter: {
    borderTop: '1px dashed grey'
  }
});

export function BillPdf({ shop, tab, bill }: { shop: Shop, tab: TabOverview, bill: Bill }) {

  const PDFTitle = `${tab.display_name} Itemized Receipt ${bill.start_date} - ${bill.end_date}`;
  const PDFAuthor = shop.name;

  let totalBalance = 0;

  const items = bill.items.map((order) => {
    if ((order.base_price === 0 && order.variants.length === 0) || order.quantity === 0) return null;
    totalBalance += order.base_price * order.quantity
    return <React.Fragment key={order.id}><View style={styleSheet.tableRow} key={order.id}>
      <Text>{order.name}</Text>
      <Text>{`${order.quantity} x ${formatCurrencyUSD(order.base_price)} (= ${formatCurrencyUSD(order.quantity * order.base_price)})`}</Text>
    </View >
      {order.variants.map(variant => {
        if (variant.price === 0 || variant.quantity === 0) return null;
        totalBalance += variant.price * variant.quantity
        return <View style={styleSheet.tableRow} key={`${order.id}-${variant.id}`}>
          <Text>&gt; {variant.name}</Text>
          <Text>{`${variant.quantity} x ${formatCurrencyUSD(variant.price)} (= ${formatCurrencyUSD(variant.quantity * variant.price)})`}</Text>
        </View>
      })}
    </React.Fragment>
  })

  return (
    <Document title={PDFTitle} author={PDFAuthor}>
      <Page size="A4" style={styleSheet.page} >
        <View style={styleSheet.section}>
          <Text>{PDFTitle}</Text>
        </View>
        <View style={styleSheet.section}>
          <View style={styleSheet.table}>
            <View style={[styleSheet.tableRow, styleSheet.tableHeader]}>
              <Text>Product</Text>
              <Text>Price</Text>
            </View>
            {items}
            <View style={[styleSheet.tableRow, styleSheet.tableFooter]}>
              <Text>Total</Text>
              <Text>{`= ${formatCurrencyUSD(totalBalance)}`}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document >
  );
}

