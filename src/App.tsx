import React from 'react';
import 'react-bootstrap'
import './App.css';
import { Container, Row, Col, Form, Table } from "react-bootstrap";

function App() {
  const [price, setPrice] = React.useState(10000);

  return (
    <Container>
      <header>
        <h1 className='header'>手数料込み料金計算機</h1>
      </header>
      <div className="App">
        <Row>
          <Col>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group as={Row} className="mb-3" controlId="price">
                <Form.Label column sm={2}>
                  手取り価格
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="number" placeholder="10000" onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </div>
      <FeeViewer price={price} />
      <div>
        <h2>使い方</h2>
        <p>手取り価格を入力すると、その金額を受け取れる手数料込みの販売価格を確認できます。</p>
        <p>購入者側にも手数料がかかる場合は購入時価格に表示されます。</p>
        <h2>出典</h2>
        <dl>
          <dt>つなぐ</dt>
          <dd>銀行決済時は2.8%、クレジットカード・コンビニ決済は5.5%。<br />
            <a href="https://tsunagu.cloud/questions">よくある質問 - システム手数料(仲介手数料)に関して</a></dd>
          <dt>アズカリ</dt>
          <dd>
            販売者4.4%、購入者4.4%。<br />
            <a href="https://azkari.jp/guide/fee.html">利用料・お支払い方法</a></dd>
          <dt>SKIMA</dt>
          <dd>
            オプションを含む販売総額によって変動します。<br />
            1,000～20,000円 22%<br />
            20,001～50,000円 16%<br />
            50,001以上 11%<br />
            <a href="https://visualworks.zendesk.com/hc/ja/articles/115007849987-%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E5%88%A9%E7%94%A8%E6%96%99%E9%87%91%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6">サービス利用料金について</a></dd>
          <dt>ココナラ</dt>
          <dd>
            <a href="https://coconala.com/pages/guide_sell">ご利用ガイド - サービスを出品したい</a><br />
            <a href="https://coconala.com/pages/guide_payment#payment-purchase">ご利用ガイド - お支払い方法</a>
          </dd>
        </dl>
      </div>
      <footer>
        <dl>
          <dt>つくったひと</dt>
          <dd><a href="https://x.com/AtanoOkakura">アタノ (Twitter)</a></dd>
          <dt>お問い合わせ / 投げ銭</dt>
          <dd><a href="https://ofuse.me/916e14fe">OFUSE</a></dd>
        </dl>
      </footer>
    </Container>
  );
}

interface CrowdsourcingSurvice {
  name: string;
  sellerFee: number;
  vendorFee: number | null;
  range: [number, number] | null;
  //備考
  note: string;
}

function FeeViewer(props: { price: number }) {
  // 手数料込みの値段を計算する関数
  // 手数料は実数で渡す
  // 10% なら 0.1
  // 22% なら 0.22
  const calcPriceWithFee = (price: number, fee: number) => {
    return Math.round(price * (1 / (1 - fee)));
  };
  const [feeList, setFeeList] = React.useState<CrowdsourcingSurvice[]>([
    // {
    //   name: "つなぐ",
    //   fee: 2.8,
    //   range: [],
    //   note: "銀行決済"
    // },
    {
      name: "つなぐ",
      sellerFee: 5.5,
      vendorFee: null,
      range: null,
      note: "銀行決済時は2.8%"
    },
    {
      name: "アズカリ",
      sellerFee: 4.4,
      vendorFee: 4.4,
      range: null,
      note: "購入者は+4.4%"
    },
    {
      name: "SKIMA",
      sellerFee: 22,
      vendorFee: null,
      range: [0, 20000],
      note: "2万以下は22%"
    }, {
      name: "SKIMA",
      sellerFee: 16,
      vendorFee: null,
      range: [20001, 50000],
      note: "5万以下16%"
    }, {
      name: "SKIMA",
      sellerFee: 11,
      vendorFee: null,
      range: [50001, 100000000],
      note: "5万超過は11%"
    },
    {
      name: "ココナラ",
      sellerFee: 22,
      vendorFee: 5.5,
      range: null,
      note: "購入者は+5.5%"
    }]);

  return (<Table striped bordered hover>
    <thead>
      <tr>
        <th>サービス名</th>
        <th>手数料</th>
        <th>手取り</th>
        <th>手数料込み</th>
        <th>購入時価格</th>
        <th>備考</th>
        {/* <th>消費税込み</th> */}
      </tr>
    </thead>
    <tbody>
      {
        feeList.filter((cs) => (cs.range?.length === 2 && props.price >= cs.range[0] && props.price <= cs.range[1]) || cs.range === null).map((cs, i) => {
          const priceWithSellerFee = calcPriceWithFee(props.price, cs.sellerFee / 100);
          const priceWithVendorFee = cs.vendorFee ? Math.floor(priceWithSellerFee + (priceWithSellerFee * (cs.vendorFee / 100))) : null;
          return (<tr key={i}>
            <td>{cs.name}</td>
            <td>{cs.sellerFee}%</td>
            <td>{props.price}円</td>
            <td>{priceWithSellerFee}円</td>
            <td>{priceWithVendorFee || "---"}</td>
            <td>{cs.note}</td>
            {/* <td>{calcPriceWithFee(calcPriceWithFee(props.price, cs.fee / 100), 0.1)}円</td> */}
          </tr>);
        })
      }
    </tbody>
  </Table>);
}

export default App;
