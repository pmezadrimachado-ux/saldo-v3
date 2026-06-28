import { createBankLookupKeys, normalizeBankName } from '../utils/bank-normalizer.js';

export const BANK_LOGOS = [
  { id: 'alelo', name: 'Alelo', assetPath: './assets/banks/alelo.jpeg', aliases: ['alelo'], color: '#B9D847' },
  { id: 'banco-do-brasil', name: 'Banco do Brasil', assetPath: './assets/banks/banco-do-brasil.png', aliases: ['banco do brasil', 'bb', 'brasil'], color: '#F7E500' },
  { id: 'bradesco', name: 'Bradesco', assetPath: './assets/banks/bradesco.png', aliases: ['bradesco', 'banco bradesco'], color: '#E0002A' },
  { id: 'c6-bank', name: 'C6 Bank', assetPath: './assets/banks/c6-bank.png', aliases: ['c6', 'c6 bank', 'banco c6'], color: '#202020' },
  { id: 'caixa', name: 'Caixa Econômica Federal', assetPath: './assets/banks/caixa-economica.jpeg', aliases: ['caixa', 'caixa economica', 'caixa economica federal', 'cef'], color: '#005CA9' },
  { id: 'caju', name: 'Caju', assetPath: './assets/banks/caju.png', aliases: ['caju', 'cartao caju', 'beneficio caju'], color: '#EF3152' },
  { id: 'flash', name: 'Flash', assetPath: './assets/banks/flash.jpeg', aliases: ['flash', 'flash beneficios', 'cartao flash'], color: '#FF2B93' },
  { id: 'ifood', name: 'iFood', assetPath: './assets/banks/ifood.png', aliases: ['ifood', 'i food', 'beneficio ifood'], color: '#EA1D2C' },
  { id: 'inter', name: 'Inter', assetPath: './assets/banks/inter.jpeg', aliases: ['inter', 'banco inter'], color: '#FF7A00' },
  { id: 'itau', name: 'Itaú', assetPath: './assets/banks/itau.jpeg', aliases: ['itau', 'itaú', 'banco itau', 'banco itaú'], color: '#FF6B00' },
  { id: 'mercado-pago', name: 'Mercado Pago', assetPath: './assets/banks/mercado-pago.jpeg', aliases: ['mercado pago', 'mercadopago', 'mp'], color: '#00B1EA' },
  { id: 'neon', name: 'Neon', assetPath: './assets/banks/neon.png', aliases: ['neon', 'banco neon'], color: '#00D7FF' },
  { id: 'next', name: 'Next', assetPath: './assets/banks/next.jpeg', aliases: ['next', 'banco next'], color: '#00F076' },
  { id: 'nubank', name: 'Nubank', assetPath: './assets/banks/nubank.png', aliases: ['nubank', 'nu', 'banco nu'], color: '#820AD1' },
  { id: 'picpay', name: 'PicPay', assetPath: './assets/banks/picpay.jpeg', aliases: ['picpay', 'pic pay'], color: '#21C25E' },
  { id: 'pluxee', name: 'Pluxee', assetPath: './assets/banks/pluxee.jpeg', aliases: ['pluxee', 'sodexo', 'sodexo beneficios'], color: '#00E86B' },
  { id: 'santander', name: 'Santander', assetPath: './assets/banks/santander.jpeg', aliases: ['santander', 'banco santander'], color: '#E60000' },
  { id: 'vr', name: 'VR', assetPath: './assets/banks/vr.png', aliases: ['vr', 'vale refeicao', 'vale refeição', 'vr beneficios', 'vr benefícios'], color: '#00A859' },
];

const BANK_LOGO_BY_ALIAS = new Map();

BANK_LOGOS.forEach((bank) => {
  [bank.name, bank.id, ...bank.aliases].forEach((alias) => {
    BANK_LOGO_BY_ALIAS.set(normalizeBankName(alias), bank);
  });
});

export function findBankLogoByName(name) {
  const keys = createBankLookupKeys(name);

  for (const key of keys) {
    const match = BANK_LOGO_BY_ALIAS.get(key);

    if (match) {
      return match;
    }
  }

  return null;
}

export function getBankLogoAssetPath(name) {
  return findBankLogoByName(name)?.assetPath ?? null;
}
