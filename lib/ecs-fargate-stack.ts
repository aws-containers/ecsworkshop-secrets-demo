import { App, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib';
import { Cluster, ContainerImage, Secret as ECSSecret } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib';

export interface ECSStackProps extends StackProps {
  vpc: Vpc
  dbSecretArn: string
}

export class ECSStack extends Stack {

  constructor(scope: App, id: string, props: ECSStackProps) {
    super(scope, id, props);

    const containerPort = this.node.tryGetContext("containerPort");
    const containerImage = this.node.tryGetContext("containerImage");
    const creds = Secret.fromSecretCompleteArn(this, 'postgresCreds', props.dbSecretArn);

    const cluster = new Cluster(this, 'Cluster', {
      vpc: props.vpc,
      clusterName: 'fargateClusterDemo'
    });

    const fargateService = new ApplicationLoadBalancedFargateService(this, "fargateService", {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromRegistry(containerImage),
        containerPort: containerPort,
        enableLogging: true,
        secrets: {
          POSTGRES_DATA: ECSSecret.fromSecretsManager(creds)
        }
      },
      desiredCount: 1,
      publicLoadBalancer: true,
      serviceName: 'fargateServiceDemo'
    });

    new CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });
  }

}