import React from 'react';
import 'react-bootstrap'
import './App.css';
import { Container, Row, Col, Form, Table } from "react-bootstrap";

function App() {
  const [price, setPrice] = React.useState(1000);

  return (
    <Container>
      <header>
        <h1>手数料込み料金計算機</h1>
      </header>
      <div className="App">
        <Row>
          <Col>
            <Form>
              <Form.Group as={Row} className="mb-3" controlId="price">
                <Form.Label column sm={2}>
                  価格
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="number" placeholder="1000" onChange={(e) => setPrice(Number(e.target.value))} />
                </Col>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </div>
      <FeeViewer price={price} />
    </Container>
  );
}

function FeeViewer(props: { price: number }) {
  // 手数料込みの値段を計算する関数
  // 手数料は実数で渡す
  // 10% なら 0.1
  // 22% なら 0.22
  const calcPriceWithFee = (price: number, fee: number) => {
    return Math.round(price * (1 / (1 - fee)));
  };
  const fees = Array.from({ length: 100 }, (_, i) => i + 1);
  return (<Table striped bordered hover>
    <thead>
      <tr>
        <th>手数料</th>
        <th>元価格</th>
        <th>手数料込み</th>
        <th>消費税込み</th>
      </tr>
    </thead>
    <tbody>
      {
        fees.map((i) => {
          return (<tr key={i}>
            <td>{i}%</td>
            <td>{props.price}円</td>
            <td>{calcPriceWithFee(props.price, i / 100)}円</td>
            <td>{calcPriceWithFee(calcPriceWithFee(props.price, i / 100), 0.1)}円</td>
          </tr>);
        })
      }
    </tbody>
  </Table>);
}

export default App;
