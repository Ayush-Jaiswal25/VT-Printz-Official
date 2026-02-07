import React from 'react'
import HeroCarousel from '../Components/HeroCarousel'
import ProductGrid from '../Components/ProductGrid'
import CustomerCarousel from '../Components/CustomerCarousel'
import FAQ from '../Components/FAQ'
import Featured from '../Components/Featured'
import VideoStories from '../Components/VideoStories'
import WatchAndBuy from './WatchAndBuy'

function Home() {
  return (
    <div className="w-full h-full pt-24">
      <VideoStories />
      <HeroCarousel />
      <div className='w-full h-full'>
        <ProductGrid />
        <WatchAndBuy />
        <CustomerCarousel />
        <Featured />
        <FAQ />
      </div>
    </div>
  )
}

export default Home