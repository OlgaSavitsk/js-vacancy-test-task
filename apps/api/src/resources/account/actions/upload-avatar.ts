import multer from "@koa/multer";

import { Next, AppKoaContext, AppRouter } from "types";

import { cloudStorageService } from "services";

import config from 'config';

const upload = multer();

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, { global: "File cannot be empty" });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;
  const { file } = ctx.request;

  const fileName = `${user._id}-${Date.now()}-${file.originalname}`;
  const Location = await cloudStorageService.uploadPublic(
    `accounts/${fileName}`,
    file
  );

  // ctx.redirect(config.WEB_URL);

  ctx.body = {photoUrl: Location};
}

export default (router: AppRouter) => {
  router.post('/avatar', upload.single("file"), validator, handler);
};
