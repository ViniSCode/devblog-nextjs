import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product} : HomeProps) {
  return (
    <>
      <Head>
        <title>Home | devblog</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <h1>DevBlog, <br/> All in one place</h1>
          <ul>
            <li>Learn something.</li>
            <li>Teach something.</li>
            <li>Share something.</li>
            <li><span> for {product.amount} month.</span></li>
          </ul>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KpzslFElNUw8kSYTRg0W4d7', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
   },
   revalidate: 60* 60 * 24, //24 hours
  }
}