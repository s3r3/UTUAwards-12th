import { motion } from 'framer-motion'
import './ShopDesign.css'

export default function ShopDesign() {
  return (
    <div className="shop">
      <div className="shop__nameContainer">
        <motion.span
          className="shop__name"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1, 1.05, 1],
            opacity: [0, 1],
            transition: {
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              opacity: { duration: 0.8, delay: 0.3 },
            },
          }}
        >
          Acelora
        </motion.span>
      </div>

      {/* roof */}
      <div className="shop__roof"></div>
      <span className="shop__roofShadow"></span>

      {/* front */}
      <div className="shop__front">
        <div className="shop__frontMainContainer">
          <span className="shop__container1"></span>
          <div className="shop__container2">
            <span className="shop__container2Product"></span>
            <span className="shop__container2Product"></span>
          </div>
          <span className="shop__container3"></span>
          <span className="shop__container4"></span>
          <span className="shop__container5"></span>
          <span className="shop__container6"></span>
          <span className="shop__container7"></span>
        </div>

        <div className="shop__frontBottom">
          <span className="shop__frontDivider"></span>
        </div>
      </div>

      {/* door */}
      <div className="shop__door">
        <span className="shop__doorGlassPanel"></span>
        <span className="shop__doorBottom"></span>
      </div>

      {/* hanging fruits */}
      <div className="shop__hangingFruit">
        <span className="shop__hangingFruitMain"></span>
        <span className="shop__hangingFruitMain"></span>
      </div>

      <div className="shop__hangingFruit shop__hangingFruit--isSecond">
        <span className="shop__hangingFruitMain"></span>
        <span className="shop__hangingFruitMain"></span>
      </div>

      <div className="shop__hangingFruit shop__hangingFruit--isThird">
        <span className="shop__hangingFruitMain"></span>
        <span className="shop__hangingFruitMain"></span>
      </div>

      {/* floor */}
      <div className="shop__floor"></div>

      {/* bar */}
      <div className="shop__bar">
        <div className="shop__hangingProduct">
          <span className="shop__hangingProductRopes"></span>
        </div>
      </div>

      {/* squash */}
      <div className="shop__squash"></div>

      {/* outer products */}
      <div className="shop__outerProducts">
        <span className="shop__outerProductRounded"></span>

        <motion.div
          className="shop__leafyProductsWrapper"
          animate={{ y: [-20, 0, -20] }}
          initial={{ opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ opacity: 1 }}
        >
          <span className="shop__leafyProduct"></span>
          <span className="shop__leafyProduct shop__leafyProduct--isFullGreen"></span>
          <span className="shop__leafyProduct shop__leafyProduct--isFullGreen"></span>
        </motion.div>

        <span className="shop__lengthyProduct shop__lengthyProduc--group1"></span>
        <span className="shop__lengthyProduct shop__lengthyProduc--group2"></span>

        <div className="shop__outerProductsBasket"></div>
        <div className="shop__outerProductsStairs"></div>
      </div>

      {/* flower */}
      <div className="shop__flower">
        {[1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="shop__sunflower"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{
              opacity: 1,
              rotate: [0, 360],
              transition: {
                rotate: {
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.5,
                },
                opacity: { duration: 0.5, delay: i * 0.5 },
              },
            }}
          />
        ))}

        <div className="shop__flowerLeaves"></div>
        <div className="shop__flowerBase"></div>
        <div className="shop__flowerPot"></div>
      </div>
    </div>
  )
}
