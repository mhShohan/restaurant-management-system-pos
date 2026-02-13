import { connectDB } from '@config';
import RestaurantSettings from '@modules/settings/settings.model';
import User from '@modules/user/user.model';
import { PasswordUtil } from '@utils/PasswordUtil';
import { logger } from '@utils/logger';

const ADMIN_EMAIL = 'admin@restaurant.com';
const ADMIN_PASSWORD = 'admin123';

async function seed() {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      logger.info(`Admin user already exists: ${ADMIN_EMAIL}`);
    } else {
      const hashedPassword = await PasswordUtil.hash(ADMIN_PASSWORD);
      await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      });
      logger.info(`Admin user created: ${ADMIN_EMAIL}`);
    }

    const settings = await RestaurantSettings.findOne();
    if (!settings) {
      await RestaurantSettings.create({
        name: 'My Restaurant',
        address: '',
        phone: '',
        email: ADMIN_EMAIL,
        taxPercentage: 0,
        serviceChargePercentage: 0,
        currency: 'USD',
      });
      logger.info('Restaurant settings initialized.');
    }

    logger.info('Seed completed.');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
