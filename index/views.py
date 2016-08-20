import collections
import json
import os
import pprint

from django.http import HttpResponse
from django.shortcuts import render
from slackclient import SlackClient

from .models import Island

TOKEN = os.environ.get('SLACK_ADMIN_TOKEN')


def index(request):
    return render(request, 'index.html')


def list(request):
    '''List all channels.'''

    response = collections.OrderedDict()
    
    if request.GET.get('token') == TOKEN:
        slack_client = SlackClient(TOKEN)
        channels = slack_client.api_call('channels.list')

        if channels.get('ok'):
            response['ok'] = True
            response['channels'] = {}

            for channel in channels.get('channels'):
                response['channels'][channel.get('name')] = channel.get('id')

        else:
            response = channels

    else:
        response['ok'] = False
        response['error'] = 'invalid token'

    return HttpResponse(json.dumps(response, indent=4), \
            content_type='application/json')


def spawn(request):
    '''Spawn an island.'''

    response = collections.OrderedDict()

    if request.GET.get('token') == TOKEN and request.GET.get('channel'):
        slack_client = SlackClient(TOKEN)
        channel_info = slack_client.api_call('channels.info',
                                            channel=request.GET.get('channel'))

        if channel_info.get('ok'):
            ch_name = channel_info.get('channel').get('name')
            ch_id = channel_info.get('channel').get('id')
            Island.objects.get_or_create(name=ch_name, cid=ch_id)

            #TODO: Populate Island w/ it's users

            response['ok'] = True
            response[ch_name] = ch_id

        else:
            response = channel_info

    else:
        response['ok'] = False
        response['error'] = 'invalid parameters'

    return HttpResponse(json.dumps(response, indent=4), \
            content_type='application/json')

