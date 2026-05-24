function missing(key: string): boolean {
  const v = process.env[key]
  return !v || v.startsWith('PASTE_') || v === ''
}

function isConfigured(): boolean {
  return !missing('HUBSPOT_ACCESS_TOKEN')
}

async function getClient(): Promise<any> {
  if (!isConfigured()) return null
  const hubspot = await import('@hubspot/api-client')
  return new hubspot.Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })
}

function val(d: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = d[k]
    if (v && String(v).trim()) return String(v).trim()
  }
  return ''
}

export async function pushLeadToHubSpot(data: Record<string, unknown>) {
  const client = await getClient()

  if (!client) {
    const name = `${val(data, 'firstName', 'first_name')} ${val(data, 'lastName', 'last_name')}`
    console.log(`[MOCK HUBSPOT] Lead created for ${name}`)
    return { success: true, contactId: 'mock', dealId: 'mock' }
  }

  const contactBody: Record<string, string> = {
    firstname: val(data, 'firstName', 'first_name'),
    lastname: val(data, 'lastName', 'last_name'),
    email: val(data, 'email'),
    phone: val(data, 'phone'),
    city: val(data, 'county', 'city'),
    state: 'TX',
    autoappeal_citation_number: val(data, 'citationNumber', 'citation_number'),
    autoappeal_violation_date: val(data, 'citationDate', 'citation_date'),
    autoappeal_agency: val(data, 'court'),
    autoappeal_deadline: val(data, 'responseDeadline', 'response_deadline'),
    autoappeal_case_status: val(data, 'status'),
  }

  const ref = val(data, 'referralSource', 'referral_source')
  if (ref) contactBody.lagnaf_referral_code = ref

  const contact = await client.crm.contacts.basicApi.create({
    body: { properties: contactBody },
  })

  const pipelineId = process.env.HUBSPOT_PIPELINE_ID
  const dealStageId = process.env.HUBSPOT_DEAL_STAGE_ID

  let dealId: string | undefined
  if (pipelineId && dealStageId) {
    const deal = await client.crm.deals.basicApi.create({
      body: {
        properties: {
          dealname: `AutoAppeal - ${contactBody.firstname} ${contactBody.lastname}`,
          pipeline: pipelineId,
          dealstage: dealStageId,
          amount: '0',
          hs_contact_id: contact.id,
        },
      },
    })
    dealId = deal.id
  }

  return { success: true, contactId: contact.id, dealId }
}
