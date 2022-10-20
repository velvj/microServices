const stripe = require('stripe')(process.env.STRIPE_KEY);

module.exports = {
    createProfile: function (profileBody) {
        let { customerReq, paymentMethodReq } = profileBody;
        console.log("paymentMethodReq", profileBody);
        return new Promise(async (resolve, reject) => {
            try {
                let paymentMethod;
                if (paymentMethodReq) {
                    paymentMethod = await stripe.paymentMethods.create(paymentMethodReq);
                    customerReq.payment_method = paymentMethod.id;
                }
                let customer = await stripe.customers.create(customerReq);

                resolve({
                    customer,
                    paymentMethod
                });
            } catch (err) {
                reject(err);
            }
        });
    },
    getCards: function (profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let cards = await stripe.paymentMethods.list({
                    customer: profileId, type: 'card'
                });
                resolve(cards);
            } catch (err) {
                reject(err);
            }
        });
    },
    addCard: function (profileId, profileBody) {
        let { paymentMethodReq } = profileBody;
        return new Promise(async (resolve, reject) => {
            try {
                let paymentMethod = await stripe.paymentMethods.create(paymentMethodReq);
                paymentMethod = await stripe.paymentMethods.attach(paymentMethod.id, {
                    customer: profileId
                });

                resolve(paymentMethod);
            } catch (err) {
                reject(err);
            }
        });
    },
    getCard: function (profileId, cardId) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await stripe.paymentMethods.list({
                    customer: profileId, type: 'card'
                });
                let { data } = result;
                let item = data.find(p => p.id === cardId);
                if (item) item = { ...item.card }
                resolve(item);
            } catch (err) {
                reject(err);
            }
        });
    },
    /**
    * @DESC : Update Card
    * @params : string/Integer
    * @return :array/json
    */

    updateCard: function (profileId, cardId, profileBody, sourceToken) {
        let { customerReq, paymentMethodReq } = profileBody;

        return new Promise(async (resolve, reject) => {
            try {
                let defaultSource = null;

                let paymentMethod = await this.getPaymentMethod(profileId, paymentMethodReq.card.number);

                if (!paymentMethod) {
                    paymentMethod = await stripe.paymentMethods.create(paymentMethodReq);
                    await stripe.paymentMethods.attach(paymentMethod.id, { customer: profileId });
                }
                let customer;
                if (sourceToken) {
                    let paymentSource = await this._createSource(profileId, sourceToken, paymentMethodReq);
                    defaultSource = paymentSource.default_source;
                    customer = await this._updateCustomersource(profileId, defaultSource, customerReq, paymentMethodReq.card);
                } else {
                    customer = await this._updateCustomer(profileId, cardId, customerReq);
                }
                resolve(customer);
                // resolve(paymentSource);
            } catch (err) {
                reject(err);
            }
        });
    },
    /**
     * @DESC : Delete Card
     * @params : string/Integer
     * @return :array/json
     */
    deleteCard: function (profileId, cardId) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await stripe.paymentMethods.detach(cardId);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    },
    /**
         * @DESC : Default- Card
         * @params : string/Integer
         * @return :array/json
         */
    getdefaultCard: function (profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = stripe.customers.retrieve(profileId);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    },

    retrieveSourceCard: function (profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = stripe.customers.retrieveSource(profileId);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    },

    createConnectedAccounts: function (accountRequest) {
        console.log(accountRequest);
        return new Promise(async (resolve, reject) => {
            try {
                let connectedAccount = await stripe.accounts.create(accountRequest);
                resolve(connectedAccount)
            } catch (error) {
                reject(error)
            }
        });
    },

    createConnectedAccountLinksExpress: function (accountRequest) {
        return new Promise(async (resolve, reject) => {
            try {
                let connectedAccountLinks = await stripe.accounts.createLoginLink(accountRequest);
                resolve(connectedAccountLinks)
            } catch (error) {
                reject(error)
            }
        });
    },
    createConnectedAccountLinksOnboarding: function (accountRequest) {
        return new Promise(async (resolve, reject) => {
            try {
                let connectedAccountLinks = await stripe.accountLinks.create(accountRequest);
                resolve(connectedAccountLinks)
            } catch (error) {
                reject(error)
            }
        });
    },

    /**
     * @DESC : Payment By Id OR Payment intent creation
     * @params : string/integer
     * @return :array/json
     */
    makeCardPayment: function (paymentRequest) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("paymentRequest", paymentRequest);
                let paymentMethod = await stripe.paymentIntents.create(paymentRequest);
                // let paymentMethod = await stripe.charges.create(paymentRequest);
                resolve(paymentMethod);
            } catch (err) {
                reject(err);
            }
        });
    },

    updatePaymentIntent(accountId, paymentRequest) {
        return new Promise(async (resolve, reject) => {
            try {

                let paymentMethod = await stripe.paymentIntents.update(accountId, paymentRequest);
                // let paymentMethod = await stripe.charges.create(paymentRequest);
                resolve(paymentMethod);
            } catch (err) {
                reject(err);
            }
        });
    },

    cancelPaymentIntents(paymentRequest) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("paymentRequest", paymentRequest);
                let paymentMethod = await stripe.paymentIntents.cancel(paymentRequest);
                resolve(paymentMethod);
            } catch (err) {
                reject(err);
            }
        });
    },

    getPayment(transId) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await stripe.paymentIntents.retrieve(transId);
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    },

    completePayment(transId) {
        return new Promise(async (resolve, reject) => {
            try {
                let paymentIntent = await stripe.paymentIntents.confirm(transId);
                resolve(paymentIntent);
            } catch (err) {
                reject(err);
            }
        });
    },
    createPayout(paymentRequest, accountId) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("paymentRequest", paymentRequest, accountId);
                let paymentMethod = await stripe.payouts.create(paymentRequest, accountId);
                // let paymentMethod = await stripe.charges.create(paymentRequest);
                resolve(paymentMethod);
            } catch (err) {
                reject(err);
            }
        });
    },
    captureFunds(paymentId, accountRequest) {
        return new Promise(async (resolve, reject) => {
            try {
                let connectedAccount = await stripe.paymentIntents.capture(paymentId, accountRequest);

                resolve(connectedAccount)
            } catch (error) {
                reject(error)
            }
        });
    },

    createRefund(paymentId, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                let obj = {
                    payment_intent: paymentId,
                }
                if (amount) {
                    obj.amount = amount * 100
                }
                resolve(await stripe.refunds.create(obj));
            } catch (error) {
                reject(error)
            }
        })
    },

    transferFund(obj) {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve(await stripe.transfers.create({
                    amount: obj.price,
                    currency: 'usd',
                    destination: obj.accountId,
                    metadata: obj.meta,
                    description: obj.description,
                    transfer_group: obj.bookingId,
                }));
            } catch (error) {
                return reject(error)
            }
        })
    },

    ephemeralKey(customerId) {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve(await stripe.ephemeralKeys.create(
                    { customer: customerId },
                    { apiVersion: '2020-08-27' }
                ))
            } catch (err) {
                return reject(err)
            }
        })
    },

    signatureVerify(rawBody, sig) {
        return new Promise(async (resolve, reject) => {
            try {
                let event = await this.stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
                resolve(event)
            } catch (error) {
                reject(error)
            }
        })
    },

    getConnectAccount(accId) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await stripe.accounts.retrieve(accId))
            } catch (error) {
                reject(error)
            }
        })
    }

};