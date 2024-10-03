import '../../assets/Invoice.css'
function Invoice() {
  return (
    <>
      {/* <!-- Receipts --> */}
      <div className="page nfeArea">
        <img className="imgCanceled" src="tarja_nf_cancelada.png" alt="" />
        <img className="imgNull" src="tarja_nf_semvalidade.png" alt="" />
        <div className="boxFields" style={{ paddingTop: '20px' }}>
          <table cellPadding="0" cellSpacing="0" border={1}>
            <tbody>
              <tr>
                <td colSpan={2} className="txt-upper">
                  We received from [ds_company_issuer_name] the products and
                  services listed on the invoice indicated alongside
                </td>
                <td rowSpan={2} className="tserie txt-center">
                  <span className="font-12" style={{ marginBottom: '5px' }}>
                    NF-e
                  </span>
                  <span>Nº [nl_invoice]</span>
                  <span>Série [ds_invoice_serie]</span>
                </td>
              </tr>
              <tr>
                <td style={{ width: '32mm' }}>
                  <span className="nf-label">Date of receipt</span>
                </td>
                <td style={{ width: '124.6mm' }}>
                  <span className="nf-label">
                    Recipient signature identification
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <hr className="hr-dashed" />
          <table cellPadding="0" cellSpacing="0" border={1}>
            <tbody>
              <tr>
                <td rowSpan={3} style={{ width: '30mm' }}>
                  <img
                    className="client_logo"
                    src="[url_logo]"
                    alt=""
                    // onError={() => (this.src = 'data:image/png;base64,')}
                  />
                </td>
                <td
                  rowSpan={3}
                  style={{ width: '46mm', fontSize: '7pt' }}
                  className="txt-center"
                >
                  <span className="mb2 bold block">
                    [ds_company_issuer_name]
                  </span>
                  <span className="block">[ds_company_address]</span>
                  <span className="block">
                    [ds_company_neighborhood] - [nu_company_cep]
                  </span>
                  <span className="block">
                    [ds_company_city_name] - [ds_company_uf]- Phone:
                    [nl_company_phone_number]
                  </span>
                </td>
                <td
                  rowSpan={3}
                  className="txtc txt-upper"
                  style={{ width: '34mm', height: '29.5mm' }}
                >
                  <h3 className="title">Danfe</h3>
                  <p className="mb2">
                    Auxiliary document for the Electronic Invoice{' '}
                  </p>
                  <p className="entradaSaida mb2">
                    <span className="identificacao">
                      <span>[ds_code_operation_type]</span>
                    </span>
                    <span className="legenda">
                      <span>0 - Entry</span>
                      <span>1 - Exit</span>
                    </span>
                  </p>
                  <p>
                    <span className="block bold">
                      <span>Nº</span>
                      <span>[nl_invoice]</span>
                    </span>
                    <span className="block bold">
                      <span>SERIAL NUMBER:</span>
                      <span>[ds_invoice_serie]</span>
                    </span>
                    <span className="block">
                      <span>Page</span>
                      <span>[actual_page]</span>
                      <span>of</span>
                      <span>[total_pages]</span>
                    </span>
                  </p>
                </td>
                <td className="txt-upper" style={{ width: '85mm' }}>
                  <span className="nf-label">Tax Control</span>
                  <span className="codigo">BarCode</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="nf-label">ACCESS KEY</span>
                  <span className="bold block txt-center info">[ds_danfe]</span>
                </td>
              </tr>
              <tr>
                <td className="txt-center valign-middle">
                  <span className="block">
                    Authentication query on the national portal NF-e{' '}
                  </span>{' '}
                  www.nfe.fazenda.gov.br/portal or on the Authorized Sefaz
                  website.
                </td>
              </tr>
            </tbody>
          </table>
          {/* <!-- Natureza da Operação --> */}
          <table
            cellPadding="0"
            cellSpacing="0"
            className="boxNaturezaOperacao no-top"
            border={1}
          >
            <tbody>
              <tr>
                <td>
                  <span className="nf-label">NATURE OF THE OPERATION</span>
                  <span className="info">[_ds_transaction_nature]</span>
                </td>
                <td style={{ width: '84.7mm' }}>
                  <span className="nf-label">[protocol_label]</span>
                  <span className="info">[ds_protocol]</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* <!-- Inscrição --> */}
          <table
            cellPadding="0"
            cellSpacing="0"
            className="boxInscricao no-top"
            border={1}
          >
            <tbody>
              <tr>
                <td>
                  <span className="nf-label">STATE REGISTRATION</span>
                  <span className="info">[nl_company_ie]</span>
                </td>
                <td style={{ width: '67.5mm' }}>
                  <span className="nf-label">STATE REGISTRATION</span>
                  <span className="info">[nl_company_ie_st]</span>
                </td>
                <td style={{ width: '64.3mm' }}>
                  <span className="nf-label">CNPJ</span>
                  <span className="info">[nl_company_cnpj_cpf]</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* <!-- Recipient/Issuer --> */}
          <p className="area-name">Recipient/Issuer</p>
          <table
            cellPadding="0"
            cellSpacing="0"
            className="boxDestinatario"
            border={1}
          >
            <tbody>
              <tr>
                <td className="pd-0">
                  <table cellPadding="0" cellSpacing="0" border={1}>
                    <tbody>
                      <tr>
                        <td>
                          <span className="nf-label">NAME/COMPANY NAME</span>
                          <span className="info">
                            [ds_client_receiver_name]
                          </span>
                        </td>
                        <td style={{ width: '40mm' }}>
                          <span className="nf-label">CNPJ/CPF</span>
                          <span className="info">[nl_client_cnpj_cpf]</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ width: '22mm' }}>
                  <span className="nf-label">DATE OF ISSUE</span>
                  <span className="info">[dt_invoice_issue]</span>
                </td>
              </tr>
              <tr>
                <td className="pd-0">
                  <table cellPadding="0" cellSpacing="0" border={1}>
                    <tbody>
                      <tr>
                        <td>
                          <span className="nf-label">ADDRESS</span>
                          <span className="info">[ds_client_address]</span>
                        </td>
                        <td style={{ width: '47mm' }}>
                          <span className="nf-label">
                            NEIGHBORHOOD/DISTRICT
                          </span>
                          <span className="info">[ds_client_neighborhood]</span>
                        </td>
                        <td style={{ width: '37.2mm' }}>
                          <span className="nf-label">CEP</span>
                          <span className="info">[nu_client_cep]</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <span className="nf-label">ENTRY/EXIT DATE</span>
                  <span className="info">[dt_input_output]</span>
                </td>
              </tr>
              <tr>
                <td className="pd-0">
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ marginBottom: '-1px' }}
                    border={1}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <span className="nf-label">MUNICIPALITY</span>
                          <span className="info">[ds_client_city_name]</span>
                        </td>
                        <td style={{ width: '34mm' }}>
                          <span className="nf-label">PHONE/FAX</span>
                          <span className="info">[nl_client_phone_number]</span>
                        </td>
                        <td style={{ width: '28mm' }}>
                          <span className="nf-label">UF</span>
                          <span className="info">[ds_client_uf]</span>
                        </td>
                        <td style={{ width: '36.5mm' }}>
                          <span className="nf-label">STATE REGISTRATION</span>
                          <span className="info">[nl_client_ie]</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <span className="nf-label">ENTRY/EXIT TIME</span>
                  <span className="info">[hr_input_output]</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Invoice
