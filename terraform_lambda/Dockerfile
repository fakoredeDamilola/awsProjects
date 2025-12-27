FROM public.ecr.aws/lambda/nodejs:18


COPY package.json package-lock.json ${LAMBDA_TASK_ROOT}

RUN npm ci

COPY tsconfig.json ${LAMBDA_TASK_ROOT}
COPY src ${LAMBDA_TASK_ROOT}/src

WORKDIR ${LAMBDA_TASK_ROOT}

RUN npm run build

CMD ["dist/handle-users.handler"]





