import { Request, Response } from 'express';

import { StandardCheckoutClient, Env, MetaInfo, StandardCheckoutPayRequest } from 'pg-sdk-node';

const clientId = "SU2502072131171772864413";

const clientSecret = "ef346d46-df05-47da-a4c6-b8e49cdf1ace";

const clientVersion = 1;

const env = Env.SANDBOX;

const checkoutController = async (req: Request, res: Response) => {
    const { amount, merchantOrderId} = req.body;

    try {
      const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
  
      const redirectUrl = "https://app.linksfam.com/brand/wallet/pg/"+merchantOrderId;
      const metaInfo = MetaInfo.builder()
        .udf1("udf1")
        .udf2("udf2")
        .build();
  
      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(amount*100)
        .redirectUrl(redirectUrl)
        .metaInfo(metaInfo)
        .build();
  
      client.pay(request)
        .then(response => {
          if (response && response.redirectUrl) {
            res.success(response);
          } else {
            res.error('Something went wrong!', 400, {});
          }
        })
        .catch(err => {
            res.error('Something went wrong!', 400, err);
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err:any) {
      const error = err;  //error thrown is of PhonePeException type
      res.error('Something went wrong!', 400, error);
    }
};

export default checkoutController;