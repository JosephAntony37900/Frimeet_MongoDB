//const { Payment, MercadoPagoConfig } = require('mercadopago');
const dotenv = require('dotenv')
const axios = require('axios');
const { response } = require('express');

dotenv.config();

exports.createPayment = async (req, res) => {

	try {
		resp = await axios.post(
			'https://api.mercadopago.com/preapproval',
			{
				preapproval_plan_id:  process.env.PLAN_ID,
				reason: 'Plan mensual',
				payer_email: req.body.email,
				card_token_id: req.body.token,
				auto_recurring: {
				  frequency: 1,
				  frequency_type: 'months',
				  transaction_amount: 100,
				  currency_id: 'MXN'
				},
				back_url: 'https://chat.openai.com/',
				status: 'authorized'
			},
			{
			  headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${process.env.APP_USER}`
			  },
			}
		  )
		  console.log('Status:', res.status);

		  res.status(201).json({
			message: "SE PAGOOOOOOOOOOO",
			cuerpo: resp.data
		});
		  
	} catch (err) {
		console.error('Algo slaio mal:(')
		console.error('Response status jijija:', err.response?.status); 
		console.error('Request headers:', err.config?.headers); 
		console.log('El error es: ', err)
		res.status(500).json({ 
			message: err.response?.data || err.message 
		});
	}
};


/* ESTO INDICA LA DOCU DE NPM COMO EJEMPLO

Inicializar el cliente de Mercado Pago con el accessToken
const client = new MercadoPagoConfig(
	{ 
		accessToken: 'TEST-8905385610825563-111622-6e9f561e5f8286e66fadeb69a95248fe-703980761',
	 	options: { timeout: 5000, idempotencyKey: 'abc' } 
	}
);

//Inicializacion del objeto de la API que queremos usar, pasando client como parametro
const payment = new Payment(client);

// Creamos el body q llevara nuestra request a MP
const body = {
	transaction_amount: 12.34,
	description: 'Descripcioncita',
	payment_method_id: '<PAYMENT_METHOD_ID>',
	payer: {
		email: '<EMAIL>'
	},
};

// Ahora creamos las options q llevara la request (opcional)
const requestOptions = {
	idempotencyKey: '<IDEMPOTENCY_KEY>',
};

// Ahora sí, hacemos la request
payment.create({ body, requestOptions }).then(console.log).catch(console.log); */