# USING S3 and dynamoDB to store state files, kind of like git

```sh
# Initialize the Terraform configuration
terraform init

# Create an execution plan
terraform plan

# Apply the configuration
terraform apply

# Destroy the resources
terraform destroy

# then comment out the backend block in the main.tf file and switch to s3 after the s3 has been created

```
