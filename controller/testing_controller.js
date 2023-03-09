const smtp = require("../helper/smtp")
const db = require("../model/database_v2")
const https = require('https');
const { helper: hlp } = require("../helper/helper");
const { json } = require("body-parser");

const helper = new hlp();

exports.testing = async function (req, res) {
  // console.log
  const obj = {
    "merchant_id" : "M000000000106",
    "table_no": "10"
  }

  const json_obj = JSON.stringify(obj)
  // console.log(json_obj)
  console.log(helper.enc_dec("decrypt", "OTgyWjRoZmhJRUpvcGUrOHlYKzdMQT09"))
  // console.log(helper.enc_dec("decrypt", req.body.data))

  console.log(helper.getCurrentDate())
  const final_data = []
  const specification_data = [
    {
      specification: {
        name: [
          "wong mee yen",
          "may hoon",
          "kuai tiao"
        ],
        price: [
          0, 0, 0
        ]
      },
      title: "Noodle type"
    },
    {
      specification: {
        name: [
          "a",
          "b",
          "c"
        ],
        price: [
          1, 2, 3
        ]
      },
      title: "testing"
    }
  ]

  for (const data of specification_data) {
    const obj = {}
    const items = []
    obj.category = data.title
    const specification = data.specification
    const specification_keys = Object.keys(specification)

    for (let index = 0; index < specification[specification_keys[0]].length; index++) {
      const items_obj = {}
      for (const key of specification_keys) {
        items_obj[key] = specification[key][index];
      }
      // items_obj.name = specification.name[index];
      // items_obj.price = specification.price[index];
      items.push(items_obj)
    }
    obj.items = items
    final_data.push(obj)
  }


  res.send(final_data)
}

exports.testing_db = async function (req, res) {
  const result = await db.raw_query("Select * from User").catch((error) => console.log("error", error))
  res.send(result)
}

exports.testing_axios = async function (req, res) {
  https.get('https://jsonplaceholder.typicode.com/users', res => {
    let data = [];

    res.on('data', chunk => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Response ended: ');
      const users = JSON.parse(Buffer.concat(data).toString());

      for (user of users) {
        console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      }

    });
  }).on('error', err => {
    console.log('Error: ', err.message);
  });
}

exports.sendMail = async function (req, res) {
  const send_mail_promise = await smtp.send_email({
    from: "spatmain8@gmail.com",
    to: "ian.ding@onesoftlab.com",
    subject: "Testing",
    html: `<!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            table, td, div, h1, p {font-family: Arial, sans-serif;}
          </style>
        </head>
        <body style="margin:0;padding:0;">
          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
            <tr>
              <td align="center" style="padding:0;">
                <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                  <tr>
                    <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
                      <img src="https://assets.codepen.io/210284/h1.png" alt="" width="300" style="height:auto;display:block;" />
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:36px 30px 42px 30px;">
                      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                        <tr>
                          <td style="padding:0 0 36px 0;color:#153643;">
                            <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Creating Email Magic</h1>
                            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan et dictum, nisi libero ultricies ipsum, posuere neque at erat.</p>
                            <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;">In tempus felis blandit</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0;">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                              <tr>
                                <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                  <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/left.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                  <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan dictum, est nisi libero ultricies ipsum, in posuere mauris neque at erat.</p>
                                  <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;">Blandit ipsum volutpat sed</a></p>
                                </td>
                                <td style="width:20px;padding:0;font-size:0;line-height:0;">&nbsp;</td>
                                <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                  <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/right.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                  <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Morbi porttitor, eget est accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed.</p>
                                  <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;">In tempus felis blandit</a></p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px;background:#ee4c50;">
                      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                        <tr>
                          <td style="padding:0;width:50%;" align="left">
                            <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                              &reg; Someone, Somewhere 2021<br/><a href="http://www.example.com" style="color:#ffffff;text-decoration:underline;">Unsubscribe</a>
                            </p>
                          </td>
                          <td style="padding:0;width:50%;" align="right">
                            <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                              <tr>
                                <td style="padding:0 0 0 10px;width:38px;">
                                  <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                </td>
                                <td style="padding:0 0 0 10px;width:38px;">
                                  <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>`
  }).catch(function (err) {
    return res.status(500).send(err)
  })

  return res.status(200).send(send_mail_promise)
}