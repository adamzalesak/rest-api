import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 5000;

app.get("/", async (req: Request, res: Response) => {
  res.contentType("application/json");

  const { queryAirportTemp, queryStockPrice, queryEval } = req.query;

  // if more than one query param is passed, return undefined
  const numParams = Object.values(req.query).filter((x) => x !== undefined);
  if (numParams.length > 1) {
    res.status(200).send(undefined);
  }

  if (queryAirportTemp) {
    const temp = await getCurrentTemperature(queryAirportTemp as string);
    res.status(200).send(temp.toString());
  }

  if (queryStockPrice) {
    const price = await getStockPrice(queryStockPrice as string);
    res.status(200).send(price.toString());
  }

  if (queryEval) {
    const result = getQueryEvaluation(queryEval as string);
    res.status(200).send(result?.toString());
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const getCurrentTemperature = async (place: string) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=b476b3f2ae83466396e123214232404&q=${place}&aqi=no`
  );
  const data = await response.json();
  return data.current.temp_c;
};

const getStockPrice = async (symbol: string) => {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
  );
  const data = await response.json();
  return data.quoteResponse.result[0].regularMarketPrice;
};

const getQueryEvaluation = (query: string): number | undefined => {
  const regex = /^[\d+\-*/()\s]+$/g;
  if (!regex.test(query)) return undefined; // check if query has invalid characters

  try {
    const result = eval(query); // evaluate the expression
    return typeof result === "number" ? result : undefined; // return result if it's a number
  } catch {
    return undefined; // return undefined if there's an error in evaluating the expression
  }
};
